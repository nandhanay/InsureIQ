"""
SHAP Explainability Service
Generates human-readable risk factor contributions that explain
why a user received their risk score. Produces output matching
the frontend mockRiskFactors format: { label, value }.
"""
from typing import List, Dict


def compute_shap_factors(profile: dict) -> List[Dict[str, float]]:
    """
    Compute SHAP-style feature importance factors for the risk prediction.
    Positive values increase risk; negative values decrease risk.

    Returns list of { label: str, value: float } sorted by absolute impact.
    """
    factors = []
    age = profile.get("age", 30)
    bmi = profile.get("bmi", 22.0)
    smoking = profile.get("smoking", False)
    alcohol = profile.get("alcohol", False)
    conditions = profile.get("chronic_conditions", [])
    family_history = profile.get("family_history", [])
    city = profile.get("city", "")

    # ── Age factor ──
    if age > 55:
        factors.append({"label": f"Age ({age})", "value": round(-0.25 - (age - 55) * 0.005, 2)})
    elif age > 40:
        factors.append({"label": f"Age ({age})", "value": round(-0.10 - (age - 40) * 0.003, 2)})
    elif age < 30:
        factors.append({"label": f"Age ({age})", "value": round(0.10, 2)})

    # ── BMI factor ──
    if bmi > 30:
        factors.append({"label": f"BMI ({bmi})", "value": round(-0.20 - (bmi - 30) * 0.03, 2)})
    elif bmi > 25:
        factors.append({"label": f"BMI ({bmi})", "value": round(-0.05 - (bmi - 25) * 0.02, 2)})
    elif 18.5 <= bmi <= 24.9:
        factors.append({"label": f"BMI ({bmi})", "value": 0.12})

    # ── Smoking ──
    if smoking:
        factors.append({"label": "Smoker", "value": -0.35})
    else:
        factors.append({"label": "Non-Smoker", "value": 0.30})

    # ── Alcohol ──
    if alcohol:
        factors.append({"label": "Alcohol Use", "value": -0.10})

    # ── Chronic conditions ──
    condition_impacts = {
        "diabetes": ("Pre-diabetes HbA1c", -0.42),
        "pre-diabetes": ("Pre-diabetes HbA1c", -0.42),
        "hypertension": ("Hypertension", -0.28),
        "blood pressure": ("Hypertension", -0.28),
        "cholesterol": ("High Cholesterol", -0.18),
        "heart": ("Heart Condition", -0.45),
        "cardiac": ("Heart Condition", -0.45),
        "asthma": ("Asthma", -0.12),
        "thyroid": ("Thyroid Disorder", -0.10),
    }

    matched_labels = set()
    for condition in conditions:
        cl = condition.lower()
        for keyword, (label, impact) in condition_impacts.items():
            if keyword in cl and label not in matched_labels:
                factors.append({"label": label, "value": impact})
                matched_labels.add(label)

    # ── Family history ──
    if family_history:
        family_impact = -0.08 * min(len(family_history), 4)
        factors.append({"label": "Family History", "value": round(family_impact, 2)})

    # ── City tier ──
    tier1_cities = ["mumbai", "delhi", "bangalore", "bengaluru", "chennai", "hyderabad", "kolkata", "pune"]
    if city.lower() in tier1_cities:
        factors.append({"label": "City Tier 1", "value": 0.12})

    # Sort by absolute value (highest impact first)
    factors.sort(key=lambda x: abs(x["value"]), reverse=True)

    return factors
