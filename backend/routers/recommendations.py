"""
Recommendations Router
Generates ranked, scored, and explained plan recommendations
based on the user's profile and risk assessment.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from models.plan import Plan
from models.watchlist import Watchlist
from services.plan_scorer import score_plan
from services.warning_engine import generate_warnings
from services.rejection_risk import estimate_rejection_risk

router = APIRouter()


@router.get("")
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate ranked plan recommendations with suitability scores,
    SHAP explanations, warnings, rejection risk, and premium forecasts.
    """
    # Get user profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Complete intake first."
        )

    # Get all plans
    plans = db.query(Plan).all()
    if not plans:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No plans available."
        )

    # Get user's watchlist
    watchlisted_ids = set(
        w.plan_id for w in db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    )

    # Build profile dict for scoring
    profile_dict = {
        "age": profile.age,
        "bmi": profile.bmi,
        "height": profile.height,
        "weight": profile.weight,
        "smoking": profile.smoking,
        "alcohol": profile.alcohol,
        "chronic_conditions": profile.chronic_conditions or [],
        "family_history": profile.family_history or [],
        "city": profile.city,
        "monthly_budget": profile.monthly_budget,
        "risk_score": profile.risk_score,
    }

    # Score each plan
    scored_plans = []
    for plan in plans:
        plan_dict = {
            "id": plan.id,
            "name": plan.name,
            "insurer": plan.insurer,
            "plan_type": plan.plan_type,
            "premium_min": plan.premium_min,
            "premium_max": plan.premium_max,
            "coverage": plan.coverage,
            "coverage_amount": plan.coverage_amount,
            "csr": plan.csr,
            "waiting_period_days": plan.waiting_period_days,
            "room_rent": plan.room_rent,
            "co_pay": plan.co_pay,
            "day1_conditions": plan.day1_conditions or [],
            "exclusions": plan.exclusions or [],
            "pros": plan.pros or [],
            "cons": plan.cons or [],
            "features": plan.features or [],
        }

        # Score the plan
        scoring = score_plan(profile_dict, plan_dict)

        # Generate warnings
        warnings = generate_warnings(profile_dict, plan_dict)

        # Estimate rejection risk
        rejection = estimate_rejection_risk(profile_dict, plan_dict)

        # Generate premium forecast
        base_premium = (plan.premium_min + plan.premium_max) / 2
        forecast = _generate_forecast(base_premium, profile_dict)

        scored_plans.append({
            "plan": plan,
            "plan_dict": plan_dict,
            "score": scoring["suitability_score"],
            "scoring": scoring,
            "warnings": warnings,
            "rejection": rejection,
            "forecast": forecast,
        })

    # Sort by suitability score descending
    scored_plans.sort(key=lambda x: x["score"], reverse=True)

    # Build response
    recommendations = []
    for rank, item in enumerate(scored_plans, 1):
        plan = item["plan"]
        scoring = item["scoring"]

        recommendations.append({
            "id": plan.id,
            "rank": rank,
            "planName": plan.name,
            "insurer": plan.insurer,
            "planType": plan.plan_type,
            "suitabilityScore": scoring["suitability_score"],
            "suitabilityBreakdown": scoring["breakdown"],
            "modelConfidence": scoring["model_confidence"],
            "rejectionRisk": item["rejection"],
            "warnings": item["warnings"],
            "shapFactors": scoring["shap_factors"],
            "explanationText": scoring["explanation_text"],
            "premiumMin": plan.premium_min,
            "premiumMax": plan.premium_max,
            "csr": plan.csr,
            "premiumForecast": item["forecast"],
            "isWatchlisted": plan.id in watchlisted_ids,
        })

    return {
        "riskScore": profile.risk_score,
        "riskTier": profile.risk_tier,
        "riskFactors": profile.risk_factors or [],
        "recommendations": recommendations,
    }


def _generate_forecast(base_premium: float, profile: dict) -> list:
    """Generate 5-year premium forecast based on profile risk."""
    risk = profile.get("risk_score", 30)
    # Higher risk = faster premium growth
    if risk >= 60:
        growth_rates = [1.0, 1.10, 1.18, 1.28, 1.40, 1.55]
    elif risk >= 35:
        growth_rates = [1.0, 1.08, 1.14, 1.22, 1.32, 1.44]
    else:
        growth_rates = [1.0, 1.05, 1.10, 1.16, 1.22, 1.30]

    return [
        {"year": i, "premium": round(base_premium * rate)}
        for i, rate in enumerate(growth_rates)
        if i in [1, 3, 5]  # Return year 1, 3, 5
    ]
