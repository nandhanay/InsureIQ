"""
Watchlist Router
Manages user's shortlisted plans and serves change monitoring data.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.plan import Plan
from models.watchlist import Watchlist
from schemas.watchlist import WatchlistToggle

router = APIRouter()


@router.get("")
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's watchlisted plans with simulated change monitoring data."""
    watchlist_items = (
        db.query(Watchlist)
        .filter(Watchlist.user_id == current_user.id)
        .order_by(Watchlist.added_at.desc())
        .all()
    )

    plan_ids = [w.plan_id for w in watchlist_items]
    plans = db.query(Plan).filter(Plan.id.in_(plan_ids)).all() if plan_ids else []
    plan_map = {p.id: p for p in plans}

    result_plans = []
    for w in watchlist_items:
        plan = plan_map.get(w.plan_id)
        if not plan:
            continue
        result_plans.append({
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
            "addedAt": w.added_at.isoformat() if w.added_at else None,
        })

    # Generate simulated change monitoring data
    changes = _generate_watchlist_changes(plans)

    return {
        "plans": result_plans,
        "changes": changes,
    }


@router.post("/toggle")
async def toggle_watchlist(
    data: WatchlistToggle,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add or remove a plan from the user's watchlist."""
    # Check plan exists
    plan = db.query(Plan).filter(Plan.id == data.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    existing = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == current_user.id,
            Watchlist.plan_id == data.plan_id,
        )
        .first()
    )

    if existing:
        # Remove from watchlist
        db.delete(existing)
        db.commit()
        return {"action": "removed", "plan_id": data.plan_id}
    else:
        # Add to watchlist
        entry = Watchlist(user_id=current_user.id, plan_id=data.plan_id)
        db.add(entry)
        db.commit()
        return {"action": "added", "plan_id": data.plan_id}


def _generate_watchlist_changes(plans: list) -> list:
    """Generate simulated change monitoring data for watchlisted plans."""
    change_templates = {
        "plan-010": {
            "planName": "Diabetes Safe",
            "insurer": "Star Health Insurance",
            "changes": [
                {"type": "premium", "direction": "up", "label": "Premium increase", "detail": "₹13,500 → ₹14,850 (+10%)", "timestamp": "2d ago"},
                {"type": "csr", "direction": "down", "label": "CSR improved", "detail": "72% → 74%", "timestamp": "1w ago"},
            ],
        },
        "plan-001": {
            "planName": "Star Comprehensive",
            "insurer": "Star Health Insurance",
            "changes": [
                {"type": "metric", "direction": "up", "label": "Network expanded", "detail": "10,000 → 10,500 hospitals", "timestamp": "4d ago"},
            ],
        },
        "plan-007": {
            "planName": "Care Supreme",
            "insurer": "Care Health Insurance",
            "changes": [
                {"type": "exclusion", "direction": "neutral", "label": "Exclusion update", "detail": "Mental health OPD now partially covered", "timestamp": "3d ago"},
                {"type": "metric", "direction": "up", "label": "Claim TAT increased", "detail": "Average 18 days → 22 days", "timestamp": "5d ago"},
            ],
        },
    }

    changes = []
    for plan in plans:
        template = change_templates.get(plan.id)
        if template:
            changes.append(template)
        else:
            # Generic change for plans without specific templates
            changes.append({
                "planName": plan.name,
                "insurer": plan.insurer,
                "changes": [
                    {"type": "metric", "direction": "neutral", "label": "No recent changes", "detail": "Plan terms unchanged", "timestamp": "1w ago"},
                ],
            })

    return changes
