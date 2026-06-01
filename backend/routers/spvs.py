from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import status as http_status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/spvs", tags=["spvs"])


def _build_spv_out(spv: models.SPV) -> dict:
    """Manually build a dict matching SPVOut (handles computed fields)."""
    lead = spv.lead_investor
    pitch = spv.pitch

    firm = None
    if lead.investor_profile:
        firm = lead.investor_profile.firm_name

    backer_count = len(spv.commitments)
    pct_funded = (
        round((spv.committed_amount / spv.target_amount) * 100, 2)
        if spv.target_amount > 0
        else 0.0
    )

    return {
        "id": spv.id,
        "pitch_id": spv.pitch_id,
        "lead_investor_id": spv.lead_investor_id,
        "lead_investor_name": lead.full_name,
        "lead_investor_firm": firm,
        "title": spv.title,
        "description": spv.description,
        "target_amount": spv.target_amount,
        "committed_amount": spv.committed_amount,
        "carry_pct": spv.carry_pct,
        "mgmt_fee_pct": spv.mgmt_fee_pct,
        "min_check": spv.min_check,
        "deadline": spv.deadline,
        "status": spv.status.value if hasattr(spv.status, "value") else spv.status,
        "created_at": spv.created_at,
        "pct_funded": pct_funded,
        "backer_count": backer_count,
        "pitch_title": pitch.title,
        "pitch_industry": pitch.industry,
        "pitch_stage": pitch.stage.value if hasattr(pitch.stage, "value") else pitch.stage,
    }


def _build_commitment_out(c: models.SPVCommitment) -> dict:
    return {
        "id": c.id,
        "investor_id": c.investor_id,
        "investor_name": c.investor.full_name,
        "amount": c.amount,
        "status": c.status,
        "created_at": c.created_at,
    }


# ── List all SPVs ─────────────────────────────────────────────────────────────

@router.get("/", response_model=List[schemas.SPVOut])
def list_spvs(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.SPV)
    if status:
        try:
            status_enum = models.SPVStatus(status)
        except ValueError:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status '{status}'. Must be forming, active, or closed.",
            )
        query = query.filter(models.SPV.status == status_enum)
    spvs = query.order_by(models.SPV.created_at.desc()).all()
    return [_build_spv_out(s) for s in spvs]


# ── SPVs I lead or committed to ───────────────────────────────────────────────

@router.get("/mine", response_model=List[schemas.SPVOut])
def my_spvs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    led = (
        db.query(models.SPV)
        .filter(models.SPV.lead_investor_id == current_user.id)
        .all()
    )
    committed_spv_ids = (
        db.query(models.SPVCommitment.spv_id)
        .filter(models.SPVCommitment.investor_id == current_user.id)
        .all()
    )
    committed_ids = {row[0] for row in committed_spv_ids}

    # Avoid duplicates if user both leads and committed (shouldn't happen, but safe)
    led_ids = {s.id for s in led}
    extra_ids = committed_ids - led_ids

    extra_spvs = (
        db.query(models.SPV)
        .filter(models.SPV.id.in_(extra_ids))
        .all()
        if extra_ids
        else []
    )

    all_spvs = led + extra_spvs
    all_spvs.sort(key=lambda s: s.created_at, reverse=True)
    return [_build_spv_out(s) for s in all_spvs]


# ── SPV detail with commitments ───────────────────────────────────────────────

@router.get("/{spv_id}", response_model=schemas.SPVOut)
def get_spv(spv_id: int, db: Session = Depends(get_db)):
    spv = db.query(models.SPV).filter(models.SPV.id == spv_id).first()
    if not spv:
        raise HTTPException(status_code=404, detail="SPV not found")
    return _build_spv_out(spv)


@router.get("/{spv_id}/commitments", response_model=List[schemas.SPVCommitmentOut])
def get_spv_commitments(spv_id: int, db: Session = Depends(get_db)):
    spv = db.query(models.SPV).filter(models.SPV.id == spv_id).first()
    if not spv:
        raise HTTPException(status_code=404, detail="SPV not found")
    return [_build_commitment_out(c) for c in spv.commitments]


# ── Create SPV ────────────────────────────────────────────────────────────────

@router.post("/", response_model=schemas.SPVOut, status_code=status.HTTP_201_CREATED)
def create_spv(
    spv_in: schemas.SPVCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.investor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only investors can create SPVs.",
        )

    pitch = db.query(models.Pitch).filter(models.Pitch.id == spv_in.pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")

    spv = models.SPV(
        pitch_id=spv_in.pitch_id,
        lead_investor_id=current_user.id,
        title=spv_in.title,
        description=spv_in.description,
        target_amount=spv_in.target_amount,
        carry_pct=spv_in.carry_pct,
        mgmt_fee_pct=spv_in.mgmt_fee_pct,
        min_check=spv_in.min_check,
        deadline=spv_in.deadline,
        committed_amount=0.0,
        status=models.SPVStatus.forming,
    )
    db.add(spv)
    db.commit()
    db.refresh(spv)
    return _build_spv_out(spv)


# ── Commit to an SPV ──────────────────────────────────────────────────────────

@router.post("/{spv_id}/commit", response_model=schemas.SPVCommitmentOut, status_code=status.HTTP_201_CREATED)
def commit_to_spv(
    spv_id: int,
    commit_in: schemas.SPVCommitRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != models.UserRole.investor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only investors can commit to SPVs.",
        )

    spv = db.query(models.SPV).filter(models.SPV.id == spv_id).first()
    if not spv:
        raise HTTPException(status_code=404, detail="SPV not found")

    if spv.status != models.SPVStatus.forming:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This SPV is no longer accepting commitments.",
        )

    if commit_in.amount < spv.min_check:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum commitment is ${spv.min_check:,.0f}.",
        )

    existing = (
        db.query(models.SPVCommitment)
        .filter(
            models.SPVCommitment.spv_id == spv_id,
            models.SPVCommitment.investor_id == current_user.id,
            models.SPVCommitment.status != "withdrawn",
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active commitment to this SPV.",
        )

    commitment = models.SPVCommitment(
        spv_id=spv_id,
        investor_id=current_user.id,
        amount=commit_in.amount,
        status="committed",
    )
    db.add(commitment)

    # Update running committed total
    spv.committed_amount += commit_in.amount
    db.commit()
    db.refresh(commitment)
    return _build_commitment_out(commitment)


# ── Withdraw commitment ───────────────────────────────────────────────────────

@router.delete("/{spv_id}/commit", status_code=status.HTTP_204_NO_CONTENT)
def withdraw_commitment(
    spv_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    spv = db.query(models.SPV).filter(models.SPV.id == spv_id).first()
    if not spv:
        raise HTTPException(status_code=404, detail="SPV not found")

    commitment = (
        db.query(models.SPVCommitment)
        .filter(
            models.SPVCommitment.spv_id == spv_id,
            models.SPVCommitment.investor_id == current_user.id,
            models.SPVCommitment.status == "committed",
        )
        .first()
    )
    if not commitment:
        raise HTTPException(
            status_code=404,
            detail="No active commitment found for this SPV.",
        )

    # Deduct from running total and mark withdrawn
    spv.committed_amount = max(0.0, spv.committed_amount - commitment.amount)
    commitment.status = "withdrawn"
    db.commit()
