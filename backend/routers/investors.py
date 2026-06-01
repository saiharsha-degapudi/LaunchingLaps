from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/investors", tags=["investors"])


@router.get("/", response_model=List[schemas.InvestorProfileOut])
def list_investors(
    skip: int = 0,
    limit: int = 50,
    industry: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.InvestorProfile)
    if industry:
        query = query.filter(models.InvestorProfile.industry_focus.ilike(f"%{industry}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/me", response_model=schemas.InvestorProfileOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = (
        db.query(models.InvestorProfile)
        .filter(models.InvestorProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.post("/", response_model=schemas.InvestorProfileOut, status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_in: schemas.InvestorProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.investor:
        raise HTTPException(status_code=403, detail="Only investors can create investor profiles.")

    existing = (
        db.query(models.InvestorProfile)
        .filter(models.InvestorProfile.user_id == current_user.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Investor profile already exists. Use PUT to update.")

    profile = models.InvestorProfile(**profile_in.model_dump(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/me", response_model=schemas.InvestorProfileOut)
def update_my_profile(
    profile_in: schemas.InvestorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = (
        db.query(models.InvestorProfile)
        .filter(models.InvestorProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create one first.")
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{profile_id}", response_model=schemas.InvestorProfileOut)
def get_investor(profile_id: int, db: Session = Depends(get_db)):
    profile = (
        db.query(models.InvestorProfile)
        .filter(models.InvestorProfile.id == profile_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Investor profile not found")
    return profile


@router.get("/match/{pitch_id}", response_model=List[schemas.InvestorProfileOut])
def match_investors_for_pitch(
    pitch_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return investors whose industry focus and stage preferences match this pitch."""
    pitch = db.query(models.Pitch).filter(models.Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    if pitch.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your pitch")

    all_profiles = db.query(models.InvestorProfile).all()
    matched = []
    for profile in all_profiles:
        focus_industries = [i.strip().lower() for i in profile.industry_focus.split(",")]
        stages = [s.strip().lower() for s in profile.preferred_stages.split(",")]
        pitch_industry = pitch.industry.lower()
        pitch_stage = pitch.stage.value.lower()

        industry_match = any(
            fi in pitch_industry or pitch_industry in fi
            for fi in focus_industries
        )
        stage_match = pitch_stage in stages

        if industry_match and stage_match and pitch.funding_goal <= profile.investment_max:
            matched.append(profile)

    return matched
