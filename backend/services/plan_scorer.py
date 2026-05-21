"""
Plan Suitability Scorer
Evaluates each insurance plan across 6 dimensions for a given user profile
and generates an overall suitability score (0-100), SHAP factors, and explanation text.
"""
from typing import Dict, List, Tuple
import math


def score_plan(profile: dict, plan: dict) -> Dict:
    """
    Score a plan for suitability against user profile.

    Returns:
        {
            suitability_score: int,
            breakdown: [{ label, score }],
            shap_factors: [{ label, value }],
            explanation_text: str,
            model_confidence: int,
        }
    """
    conditions = [c.lower() for c in profile.get("chronic_conditions", [])]
    budget = profile.get("monthly_budget", 1500)
    annual_budget = budget * 12
    age = profile.get("age", 30)
    bmi = profile.get("bmi", 22)
    risk_score = profile.get("risk_score", 30)

    plan_name = plan.get("name", "")
    plan_type = plan.get("plan_type", "")
    premium_min = plan.get("premium_min", 10000)
    premium_max = plan.get("premium_max", 15000)
    coverage_amount = plan.get("coverage_amount", 500000)
    csr = plan.get("csr", 60)
    waiting_days = plan.get("waiting_period_days", 730)
    co_pay = plan.get("co_pay", "")
    room_rent = plan.get("room_rent", "")
    features = plan.get("features", [])
    exclusions = plan.get("exclusions", [])

    avg_premium = (premium_min + premium_max) / 2

    # ── Health Fit ──
    health_fit = 70
    has_diabetes = any("diabet" in c for c in conditions)
    has_hypertension = any("hypertension" in c or "blood pressure" in c for c in conditions)

    if has_diabetes and "diabetes" in plan_name.lower():
        health_fit = 95  # Condition-specific plan matches
    elif has_diabetes and any("chronic" in f.lower() or "diabetes" in f.lower() for f in features):
        health_fit = 88
    elif not conditions:
        health_fit = 85  # Healthy user, most plans fit well

    if bmi > 30:
        health_fit -= 5
    if age > 50:
        health_fit -= 3

    health_fit = max(30, min(100, health_fit))

    # ── Budget Fit ──
    if annual_budget <= 0:
        budget_fit = 50
    else:
        ratio = avg_premium / annual_budget
        if ratio <= 0.5:
            budget_fit = 95
        elif ratio <= 0.75:
            budget_fit = 82
        elif ratio <= 1.0:
            budget_fit = 65
        elif ratio <= 1.3:
            budget_fit = 45
        else:
            budget_fit = 25

    # ── Coverage Score ──
    if coverage_amount >= 5000000:
        coverage_score = 98
    elif coverage_amount >= 2500000:
        coverage_score = 92
    elif coverage_amount >= 1000000:
        coverage_score = 82
    elif coverage_amount >= 500000:
        coverage_score = 70
    else:
        coverage_score = 55

    # ── Waiting Period Score ──
    if waiting_days <= 365:
        waiting_score = 92
    elif waiting_days <= 730:
        waiting_score = 75
    elif waiting_days <= 1095:
        waiting_score = 60
    else:
        waiting_score = 45

    # ── CSR Score ──
    if csr >= 80:
        csr_score = 90
    elif csr >= 70:
        csr_score = 78
    elif csr >= 60:
        csr_score = 65
    else:
        csr_score = 50

    # ── Underwriting Score ──
    underwriting = 80
    if bmi > 30:
        underwriting -= 8
    if len(conditions) > 2:
        underwriting -= 10
    elif len(conditions) > 0:
        underwriting -= 5
    if age > 50:
        underwriting -= 5

    if "condition" in plan_type.lower():
        underwriting += 8  # Condition-specific plans are more lenient

    underwriting = max(30, min(100, underwriting))

    # ── Overall Score ──
    weights = {
        "health": 0.25,
        "budget": 0.20,
        "coverage": 0.15,
        "waiting": 0.15,
        "csr": 0.12,
        "underwriting": 0.13,
    }
    overall = round(
        health_fit * weights["health"]
        + budget_fit * weights["budget"]
        + coverage_score * weights["coverage"]
        + waiting_score * weights["waiting"]
        + csr_score * weights["csr"]
        + underwriting * weights["underwriting"]
    )

    breakdown = [
        {"label": "Health Fit", "score": health_fit},
        {"label": "Budget Fit", "score": budget_fit},
        {"label": "Coverage", "score": coverage_score},
        {"label": "Waiting Period", "score": waiting_score},
        {"label": "CSR", "score": csr_score},
        {"label": "Underwriting", "score": underwriting},
    ]

    # ── SHAP factors for this plan ──
    shap_factors = _generate_plan_shap(profile, plan, breakdown)

    # ── Explanation text ──
    explanation = _generate_explanation(plan, profile, breakdown, overall)

    # ── Model Confidence ──
    confidence = min(97, 80 + (overall // 10))

    return {
        "suitability_score": overall,
        "breakdown": breakdown,
        "shap_factors": shap_factors,
        "explanation_text": explanation,
        "model_confidence": confidence,
    }


def _generate_plan_shap(profile: dict, plan: dict, breakdown: List[Dict]) -> List[Dict]:
    """Generate SHAP-style factors explaining why this plan was recommended."""
    factors = []
    conditions = [c.lower() for c in profile.get("chronic_conditions", [])]
    csr = plan.get("csr", 60)
    co_pay = plan.get("co_pay", "")
    room_rent = plan.get("room_rent", "")
    waiting_days = plan.get("waiting_period_days", 730)
    coverage_amount = plan.get("coverage_amount", 500000)
    premium_min = plan.get("premium_min", 10000)
    age = profile.get("age", 30)
    bmi = profile.get("bmi", 22)

    # CSR
    if csr >= 70:
        factors.append({"label": f"CSR ({csr}%)", "value": round(0.15 + (csr - 70) * 0.01, 2)})
    else:
        factors.append({"label": f"CSR ({csr}%)", "value": round(-0.10 - (70 - csr) * 0.005, 2)})

    # Room rent
    if "no cap" in room_rent.lower():
        factors.append({"label": "No Room Cap", "value": 0.28})
    else:
        factors.append({"label": "Room Rent Cap", "value": -0.12})

    # Co-pay
    if "no co-pay" in co_pay.lower() or "no co" in co_pay.lower():
        factors.append({"label": "No Co-Pay", "value": 0.22})
    elif "co-pay" in co_pay.lower() or "co pay" in co_pay.lower():
        factors.append({"label": "Co-Pay Applies", "value": -0.15})

    # Waiting period
    if waiting_days <= 365:
        factors.append({"label": f"PED Wait {waiting_days // 365}yr", "value": 0.20})
    elif waiting_days <= 730:
        factors.append({"label": f"PED Wait {waiting_days // 365}yr", "value": -0.08})
    else:
        years = waiting_days // 365
        factors.append({"label": f"PED Wait {years}yr", "value": round(-0.15 - (years - 2) * 0.05, 2)})

    # Coverage
    if coverage_amount >= 10000000:
        factors.append({"label": "Coverage ₹1Cr", "value": 0.45})
    elif coverage_amount >= 2500000:
        factors.append({"label": f"Coverage ₹{coverage_amount // 100000}L", "value": 0.40})
    elif coverage_amount >= 1000000:
        factors.append({"label": f"Coverage ₹{coverage_amount // 100000}L", "value": 0.20})
    else:
        factors.append({"label": f"Coverage ₹{coverage_amount // 100000}L", "value": -0.12})

    # Age
    if age > 45:
        factors.append({"label": f"Age ({age})", "value": round(-0.10 - (age - 45) * 0.003, 2)})

    # BMI
    if bmi > 30:
        factors.append({"label": f"BMI Risk", "value": round(-0.15 - (bmi - 30) * 0.02, 2)})

    # Condition match
    has_diabetes = any("diabet" in c for c in conditions)
    if has_diabetes and "diabetes" in plan.get("name", "").lower():
        factors.append({"label": "Pre-diabetes", "value": 0.42})

    factors.sort(key=lambda x: abs(x["value"]), reverse=True)
    return factors[:6]  # Top 6 factors


def _generate_explanation(plan: dict, profile: dict, breakdown: List[Dict], score: int) -> str:
    """Generate a human-readable explanation for the recommendation."""
    name = plan.get("name", "This plan")
    csr = plan.get("csr", 60)
    waiting_days = plan.get("waiting_period_days", 730)
    co_pay = plan.get("co_pay", "")
    room_rent = plan.get("room_rent", "")
    conditions = profile.get("chronic_conditions", [])

    parts = []

    if score >= 80:
        parts.append(f"{name} is an excellent match for your profile.")
    elif score >= 65:
        parts.append(f"{name} is a strong option for your needs.")
    else:
        parts.append(f"{name} is a viable option with some trade-offs.")

    if "no cap" in room_rent.lower():
        parts.append("No room rent cap ensures full hospitalization coverage.")
    if "no co-pay" in co_pay.lower():
        parts.append(f"Backed by CSR of {csr}% with no co-pay clause.")

    has_diabetes = any("diabet" in c.lower() for c in conditions)
    if has_diabetes and "diabetes" in plan.get("name", "").lower():
        parts.append("Specifically designed for diabetic/pre-diabetic profiles with shorter waiting periods.")

    years = waiting_days // 365
    if years >= 3:
        parts.append(f"The {years}-year PED waiting period is a concern given your health conditions.")
    elif years <= 1:
        parts.append(f"Only {years}-year waiting period for pre-existing conditions is highly favorable.")

    budget = profile.get("monthly_budget", 1500)
    avg_premium = (plan.get("premium_min", 0) + plan.get("premium_max", 0)) / 2
    if avg_premium > budget * 12:
        parts.append(f"Premium may exceed your stated monthly budget of ₹{int(budget):,}.")

    return " ".join(parts)
