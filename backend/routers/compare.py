"""
Compare Router
Serves side-by-side plan comparison data.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from models.plan import Plan
from services.plan_scorer import score_plan

router = APIRouter()


@router.get("")
async def compare_plans(
    plan_ids: str = Query(..., description="Comma-separated plan IDs, e.g. plan-010,plan-001,plan-007"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Compare 2-3 plans side-by-side.
    Returns plan details with suitability scores for the current user.
    """
    ids = [pid.strip() for pid in plan_ids.split(",") if pid.strip()]

    if len(ids) < 2:
        raise HTTPException(status_code=400, detail="At least 2 plan IDs required")
    if len(ids) > 3:
        ids = ids[:3]

    plans = db.query(Plan).filter(Plan.id.in_(ids)).all()
    if len(plans) < 2:
        raise HTTPException(status_code=404, detail="Not enough plans found")

    # Get user profile for scoring
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    result = []
    for plan in plans:
        plan_data = {
            "id": plan.id,
            "planName": plan.name,
            "insurer": plan.insurer,
            "suitabilityScore": 0,
            "premium": f"₹{int(plan.premium_min):,} — ₹{int(plan.premium_max):,}",
            "coverage": plan.coverage,
            "waitingPeriod": f"{plan.waiting_period_days} days",
            "roomRent": plan.room_rent,
            "coPay": plan.co_pay,
            "csr": plan.csr,
            "day1Conditions": plan.day1_conditions or [],
            "exclusions": plan.exclusions or [],
            "pros": plan.pros or [],
            "cons": plan.cons or [],
        }

        # Score if profile exists
        if profile:
            profile_dict = {
                "age": profile.age,
                "bmi": profile.bmi,
                "smoking": profile.smoking,
                "alcohol": profile.alcohol,
                "chronic_conditions": profile.chronic_conditions or [],
                "family_history": profile.family_history or [],
                "city": profile.city,
                "monthly_budget": profile.monthly_budget,
                "risk_score": profile.risk_score,
            }
            plan_dict = {
                "name": plan.name,
                "plan_type": plan.plan_type,
                "premium_min": plan.premium_min,
                "premium_max": plan.premium_max,
                "coverage_amount": plan.coverage_amount,
                "csr": plan.csr,
                "waiting_period_days": plan.waiting_period_days,
                "co_pay": plan.co_pay,
                "room_rent": plan.room_rent,
                "features": plan.features or [],
                "exclusions": plan.exclusions or [],
            }
            scoring = score_plan(profile_dict, plan_dict)
            plan_data["suitabilityScore"] = scoring["suitability_score"]

        result.append(plan_data)

    return {
        "plans": result,
        "userConditions": (profile.chronic_conditions or []) if profile else [],
    }
