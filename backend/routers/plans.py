"""
Plans Router
Serves the pre-seeded insurance plan catalog.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.plan import Plan

router = APIRouter()


def _plan_to_response(plan: Plan) -> dict:
    """Convert a Plan ORM object to the frontend-expected camelCase format."""
    return {
        "id": plan.id,
        "name": plan.name,
        "insurer": plan.insurer,
        "planType": plan.plan_type,
        "premiumMin": plan.premium_min,
        "premiumMax": plan.premium_max,
        "coverage": plan.coverage,
        "coverageAmount": plan.coverage_amount,
        "csr": plan.csr,
        "waitingPeriodDays": plan.waiting_period_days,
        "roomRent": plan.room_rent,
        "coPay": plan.co_pay,
        "day1Conditions": plan.day1_conditions or [],
        "exclusions": plan.exclusions or [],
        "pros": plan.pros or [],
        "cons": plan.cons or [],
        "features": plan.features or [],
    }


@router.get("")
async def list_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all available insurance plans."""
    plans = db.query(Plan).all()
    return [_plan_to_response(p) for p in plans]


@router.get("/{plan_id}")
async def get_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detailed information about a specific plan."""
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return _plan_to_response(plan)
