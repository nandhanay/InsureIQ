"""
Underwriting Rejection Risk Estimator
Estimates probability that an insurer will reject or impose loading
on a user's application based on health profile parameters.
"""
from typing import Dict


def estimate_rejection_risk(profile: dict, plan: dict) -> Dict:
    """
    Estimate rejection risk for a given user profile + plan combination.

    Returns:
        { label: 'Low' | 'Moderate' | 'High', score: int (0-100) }
    """
    score = 5  # baseline

    age = profile.get("age", 30)
    bmi = profile.get("bmi", 22.0)
    smoking = profile.get("smoking", False)
    conditions = profile.get("chronic_conditions", [])
    family_history = profile.get("family_history", [])

    # ── Age-based risk ──
    if age > 60:
        score += 20
    elif age > 50:
        score += 12
    elif age > 45:
        score += 6

    # ── BMI-based risk ──
    if bmi > 35:
        score += 22
    elif bmi > 30:
        score += 14
    elif bmi > 27:
        score += 6

    # ── Smoking ──
    if smoking:
        score += 12

    # ── Conditions severity ──
    high_risk_keywords = ["diabetes", "heart", "cardiac", "cancer", "kidney", "liver"]
    medium_risk_keywords = ["hypertension", "cholesterol", "asthma", "thyroid"]

    for cond in conditions:
        cl = cond.lower()
        if any(k in cl for k in high_risk_keywords):
            score += 12
        elif any(k in cl for k in medium_risk_keywords):
            score += 6

    # ── Family history ──
    score += min(len(family_history) * 3, 12)

    # ── Plan-specific adjustments ──
    waiting_days = plan.get("waiting_period_days", 730)
    if waiting_days <= 365:
        # Plans with shorter waiting periods are more lenient
        score -= 5
    elif waiting_days >= 1095:
        # Stricter underwriting for plans with long waiting periods
        score += 5

    # Plans that are condition-specific (e.g., Diabetes Safe) are more accepting
    plan_type = plan.get("plan_type", "")
    if "condition" in plan_type.lower() or "specific" in plan_type.lower():
        score -= 10

    # Cap score
    score = max(0, min(score, 100))

    if score >= 50:
        label = "High"
    elif score >= 25:
        label = "Moderate"
    else:
        label = "Low"

    return {"label": label, "score": score}
