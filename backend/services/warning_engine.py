"""
Smart Warning Engine
Generates contextual policy warnings based on user profile + plan characteristics.
Outputs match the frontend Warning interface: { type, severity, message }.
"""
from typing import List, Dict


def generate_warnings(profile: dict, plan: dict) -> List[Dict]:
    """
    Generate smart warnings for a plan given the user's profile.

    Returns list of { type: str, severity: str, message: str }
    """
    warnings = []

    conditions = [c.lower() for c in profile.get("chronic_conditions", [])]
    budget = profile.get("monthly_budget", 1500)
    age = profile.get("age", 30)
    bmi = profile.get("bmi", 22)

    co_pay = plan.get("co_pay", "")
    room_rent = plan.get("room_rent", "")
    waiting_days = plan.get("waiting_period_days", 730)
    premium_min = plan.get("premium_min", 0)
    premium_max = plan.get("premium_max", 0)
    exclusions = plan.get("exclusions", [])
    plan_name = plan.get("name", "")
    avg_premium = (premium_min + premium_max) / 2

    has_diabetes = any("diabet" in c for c in conditions)
    has_hypertension = any("hypertension" in c or "blood pressure" in c for c in conditions)
    has_cholesterol = any("cholesterol" in c for c in conditions)

    # ── PED Waiting Period Warning ──
    if conditions and waiting_days > 365:
        years = waiting_days // 365
        condition_names = ", ".join(profile.get("chronic_conditions", [])[:2])
        warnings.append({
            "type": "PED Waiting",
            "severity": "high" if years >= 3 else "medium",
            "message": f"{years}-year waiting period for pre-existing {condition_names}."
        })

    # ── Co-Pay Warning ──
    if "co-pay" in co_pay.lower() or "co pay" in co_pay.lower():
        if "no co-pay" not in co_pay.lower() and "no co" not in co_pay.lower():
            msg = co_pay
            if has_diabetes and "diabetes" in plan_name.lower():
                msg = f"10% co-pay applies on all diabetes-related claims."
            warnings.append({
                "type": "Co-Pay",
                "severity": "medium",
                "message": msg
            })

    # ── Budget Warning ──
    annual_budget = budget * 12
    if avg_premium > annual_budget:
        warnings.append({
            "type": "Budget",
            "severity": "high",
            "message": f"Premium exceeds your stated monthly budget of ₹{int(budget):,}."
        })

    # ── Underwriting Warning ──
    if bmi > 30 and conditions:
        warnings.append({
            "type": "Underwriting",
            "severity": "medium",
            "message": f"BMI above 30 may trigger additional medical tests."
        })

    if len(conditions) >= 2:
        warnings.append({
            "type": "Underwriting",
            "severity": "medium",
            "message": "Chronic disease management requires upfront declaration."
        })

    # ── Exclusion Conflict Warning ──
    user_condition_keywords = []
    if has_diabetes:
        user_condition_keywords.extend(["diabetes", "diabetic"])
    if has_hypertension:
        user_condition_keywords.extend(["hypertension", "blood pressure"])
    if has_cholesterol:
        user_condition_keywords.extend(["cholesterol"])

    for excl in exclusions:
        excl_lower = excl.lower()
        for keyword in user_condition_keywords:
            if keyword in excl_lower:
                warnings.append({
                    "type": "Exclusion",
                    "severity": "high",
                    "message": f"Plan exclusion may affect your condition: {excl}"
                })
                break  # Don't duplicate per exclusion

    # ── Room Rent Cap Warning ──
    if "%" in room_rent or "cap" in room_rent.lower():
        if "no cap" not in room_rent.lower():
            warnings.append({
                "type": "Room Rent",
                "severity": "low",
                "message": f"Room rent capped at: {room_rent}. Out-of-pocket costs possible."
            })

    # ── Age Warning ──
    if age > 55:
        warnings.append({
            "type": "Age",
            "severity": "medium",
            "message": f"Some benefits may be reduced for applicants over 55."
        })

    # Deduplicate by type (keep first occurrence)
    seen_types = set()
    unique_warnings = []
    for w in warnings:
        key = f"{w['type']}:{w['message'][:30]}"
        if key not in seen_types:
            seen_types.add(key)
            unique_warnings.append(w)

    return unique_warnings
