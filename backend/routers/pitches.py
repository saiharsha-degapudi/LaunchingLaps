from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/pitches", tags=["pitches"])


@router.get("/", response_model=List[schemas.PitchOut])
def list_pitches(
    skip: int = 0,
    limit: int = 50,
    industry: str = None,
    stage: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Pitch).filter(models.Pitch.is_active == True)
    if industry:
        query = query.filter(models.Pitch.industry.ilike(f"%{industry}%"))
    if stage:
        query = query.filter(models.Pitch.stage == stage)
    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=schemas.PitchOut, status_code=status.HTTP_201_CREATED)
def create_pitch(
    pitch_in: schemas.PitchCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.entrepreneur:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only entrepreneurs can submit pitches.",
        )
    pitch = models.Pitch(**pitch_in.model_dump(), owner_id=current_user.id)
    db.add(pitch)
    db.commit()
    db.refresh(pitch)
    return pitch


@router.get("/{pitch_id}", response_model=schemas.PitchOut)
def get_pitch(pitch_id: int, db: Session = Depends(get_db)):
    pitch = db.query(models.Pitch).filter(models.Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    return pitch


@router.put("/{pitch_id}", response_model=schemas.PitchOut)
def update_pitch(
    pitch_id: int,
    pitch_in: schemas.PitchUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pitch = db.query(models.Pitch).filter(models.Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    if pitch.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your pitch")
    for field, value in pitch_in.model_dump(exclude_unset=True).items():
        setattr(pitch, field, value)
    db.commit()
    db.refresh(pitch)
    return pitch


@router.delete("/{pitch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pitch(
    pitch_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pitch = db.query(models.Pitch).filter(models.Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    if pitch.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your pitch")
    db.delete(pitch)
    db.commit()


@router.post("/{pitch_id}/interest", response_model=schemas.InvestorInterestOut)
def express_interest(
    pitch_id: int,
    interest_in: schemas.InvestorInterestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.investor:
        raise HTTPException(status_code=403, detail="Only investors can express interest.")

    pitch = db.query(models.Pitch).filter(models.Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")

    profile = (
        db.query(models.InvestorProfile)
        .filter(models.InvestorProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=400, detail="Complete your investor profile first.")

    existing = (
        db.query(models.InvestorInterest)
        .filter(
            models.InvestorInterest.investor_profile_id == profile.id,
            models.InvestorInterest.pitch_id == pitch_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already expressed interest in this pitch.")

    interest = models.InvestorInterest(
        investor_profile_id=profile.id,
        pitch_id=pitch_id,
        note=interest_in.note,
    )
    db.add(interest)
    db.commit()
    db.refresh(interest)
    return interest


@router.patch("/{pitch_id}/audit", response_model=schemas.PitchOut)
def audit_pitch(
    pitch_id: int,
    audit_in: schemas.PitchAuditUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.audit:
        raise HTTPException(status_code=403, detail="Only audit team members can update audit status.")
    if audit_in.audit_status not in ("open", "proceed", "rejected"):
        raise HTTPException(status_code=400, detail="audit_status must be open, proceed, or rejected.")
    pitch = db.query(models.Pitch).filter(models.Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    pitch.audit_status = audit_in.audit_status
    db.commit()
    db.refresh(pitch)
    return pitch


@router.get("/my/pitches", response_model=List[schemas.PitchOut])
def my_pitches(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Pitch)
        .filter(models.Pitch.owner_id == current_user.id)
        .all()
    )
