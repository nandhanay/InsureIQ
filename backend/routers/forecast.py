"""
Forecast Router
Serves premium growth forecasts and what-if simulation results.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from models.plan import Plan
from models.watchlist import Watchlist
from schemas.forecast import SimulateRequest

router = APIRouter()

# Color palette for forecast chart lines
PLAN_COLORS = {
    "plan-010": "#34D399",
    "plan-001": "#60A5FA",
    "plan-007": "#FBBF24",
    "plan-005": "#F87171",
    "plan-006": "#A78BFA",
    "plan-002": "#FB923C",
    "plan-003": "#2DD4BF",
    "plan-004": "#E879F9",
    "plan-008": "#38BDF8",
    "plan-009": "#A3E635",
}


@router.get("")
async def get_forecasts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate premium forecasts for the user's recommended plans.
    Returns data matching frontend PlanForecast interface.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Get watchlisted plans, or top 5 plans by default
    watchlisted = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    watchlisted_ids = [w.plan_id for w in watchlisted]

    if watchlisted_ids:
        plans = db.query(Plan).filter(Plan.id.in_(watchlisted_ids)).all()
    else:
        plans = db.query(Plan).limit(5).all()

    risk_score = profile.risk_score or 30

    forecasts = []
    for plan in plans:
        base = (plan.premium_min + plan.premium_max) / 2
        data = _forecast_series(base, risk_score, 6)
        forecasts.append({
            "planId": plan.id,
            "planName": plan.name,
            "insurer": plan.insurer,
            "color": PLAN_COLORS.get(plan.id, "#94A3B8"),
            "data": data,
        })

    return {"forecasts": forecasts}


@router.post("/simulate")
async def simulate_forecast(
    req: SimulateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Run a what-if premium simulation.
    Adjusts premiums based on income changes, new conditions, and coverage increases.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Get top 3 plans
    watchlisted = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    watchlisted_ids = [w.plan_id for w in watchlisted]

    if watchlisted_ids:
        plans = db.query(Plan).filter(Plan.id.in_(watchlisted_ids[:3])).all()
    else:
        plans = db.query(Plan).limit(3).all()

    results = []
    warning = None

    for plan in plans:
        original = round((plan.premium_min + plan.premium_max) / 2)
        simulated = original

        # New condition impact
        if req.new_condition:
            condition_multipliers = {
                "diabetes": 1.20,
                "heart": 1.35,
                "thyroid": 1.10,
            }
            mult = condition_multipliers.get(req.new_condition, 1.15)
            simulated = round(simulated * mult)
            warning = "Adding a new condition significantly impacts premium and may affect underwriting eligibility."

        # Coverage increase impact
        if req.coverage_increase > 0:
            simulated += round(req.coverage_increase * 7)

        # Income change impact (subtle)
        income_multipliers = {
            "below-3": 0.95,
            "5-10": 0.98,
            "10-20": 1.0,
            "20-50": 1.02,
            "above-50": 1.05,
        }
        simulated = round(simulated * income_multipliers.get(req.income, 1.0))

        change_pct = round(((simulated - original) / original) * 100) if original > 0 else 0
        change_str = f"+{change_pct}%" if change_pct >= 0 else f"{change_pct}%"

        results.append({
            "plan": plan.name,
            "original": original,
            "simulated": simulated,
            "change": change_str,
        })

    return {
        "results": results,
        "warning": warning,
    }


def _forecast_series(base_premium: float, risk_score: float, years: int) -> list:
    """Generate year-over-year premium forecast data points."""
    if risk_score >= 60:
        annual_growth = 0.10
    elif risk_score >= 35:
        annual_growth = 0.08
    else:
        annual_growth = 0.06

    data = []
    premium = base_premium
    for year in range(years):
        data.append({"year": year, "premium": round(premium)})
        premium *= (1 + annual_growth + (year * 0.005))  # Slight acceleration

    return data
