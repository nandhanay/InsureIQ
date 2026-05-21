"""
Health Risk Prediction Service
Uses a rule-based scoring engine with XGBoost-style weighting.
If a trained model exists, loads it; otherwise uses deterministic scoring.
"""
import os
import math
import pickle
import numpy as np
from typing import Dict, List, Tuple


MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "models", "risk_clf.pkl")


def _calculate_bmi(height_cm: float, weight_kg: float) -> float:
    """Calculate BMI from height (cm) and weight (kg)."""
    if height_cm <= 0:
        return 25.0
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m ** 2), 1)


def _build_feature_vector(profile: dict) -> dict:
    """Build a feature dictionary from user profile data."""
    age = profile.get("age", 30)
    bmi = profile.get("bmi") or _calculate_bmi(
        profile.get("height", 170), profile.get("weight", 70)
    )
    smoking = 1 if profile.get("smoking") else 0
    alcohol = 1 if profile.get("alcohol") else 0

    conditions = profile.get("chronic_conditions", [])
    family_hist = profile.get("family_history", [])
    extracted = profile.get("extracted_values", {})

    has_diabetes = 1 if any("diabet" in c.lower() for c in conditions) else 0
    if not has_diabetes and extracted:
        hba1c_status = extracted.get("hba1c", {}).get("status", "normal")
        glucose_status = extracted.get("glucose", {}).get("status", "normal")
        if hba1c_status in ("high", "elevated") or glucose_status == "high":
            has_diabetes = 1

    has_hypertension = 1 if any("hypertension" in c.lower() or "blood pressure" in c.lower() for c in conditions) else 0
    if not has_hypertension and extracted:
        bp_status = extracted.get("bloodPressure", {}).get("status", "normal")
        if bp_status == "high":
            has_hypertension = 1

    has_cholesterol = 1 if any("cholesterol" in c.lower() for c in conditions) else 0
    if not has_cholesterol and extracted:
        chol_status = extracted.get("cholesterol", {}).get("status", "normal")
        ldl_status = extracted.get("ldl", {}).get("status", "normal")
        if chol_status in ("high", "elevated") or ldl_status in ("high", "elevated"):
            has_cholesterol = 1

    has_heart = 1 if any("heart" in c.lower() or "cardiac" in c.lower() for c in conditions) else 0

    # Count unique conditions combining manual and clinical report detections
    detected_conditions = set(c.lower() for c in conditions)
    if has_diabetes:
        detected_conditions.add("diabetes")
    if has_hypertension:
        detected_conditions.add("hypertension")
    if has_cholesterol:
        detected_conditions.add("cholesterol")
    if has_heart:
        detected_conditions.add("heart")

    num_conditions = len(detected_conditions)
    num_family = len(family_hist)

    family_diabetes = 1 if any("diabet" in f.lower() for f in family_hist) else 0
    family_hypertension = 1 if any("hypertension" in f.lower() or "blood pressure" in f.lower() for f in family_hist) else 0

    return {
        "age": age,
        "bmi": bmi,
        "smoking": smoking,
        "alcohol": alcohol,
        "num_conditions": num_conditions,
        "num_family_history": num_family,
        "has_diabetes": has_diabetes,
        "has_hypertension": has_hypertension,
        "has_cholesterol": has_cholesterol,
        "has_heart": has_heart,
        "family_diabetes": family_diabetes,
        "family_hypertension": family_hypertension,
    }


def predict_risk(profile: dict) -> Tuple[float, str]:
    """
    Predict health risk score (0-100) and risk tier.

    Returns:
        (risk_score, risk_tier) where tier is Low/Moderate/High
    """
    features = _build_feature_vector(profile)

    # Try loading trained model
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                model = pickle.load(f)
            feature_array = np.array([[
                features["age"], features["bmi"], features["smoking"],
                features["alcohol"], features["num_conditions"],
                features["num_family_history"], features["has_diabetes"],
                features["has_hypertension"], features["has_cholesterol"],
                features["has_heart"],
            ]])
            score = float(model.predict_proba(feature_array)[0][1]) * 100
            score = min(max(round(score, 1), 0), 100)
            tier = _score_to_tier(score)
            return score, tier
        except Exception:
            pass  # Fall through to rule-based

    # Rule-based deterministic scoring
    score = 10.0  # base

    # Age contribution (sigmoid curve)
    if features["age"] > 60:
        score += 20
    elif features["age"] > 45:
        score += 12
    elif features["age"] > 35:
        score += 6
    elif features["age"] > 25:
        score += 2

    # BMI contribution
    if features["bmi"] > 35:
        score += 18
    elif features["bmi"] > 30:
        score += 12
    elif features["bmi"] > 27:
        score += 6
    elif features["bmi"] > 25:
        score += 3

    # Lifestyle
    if features["smoking"]:
        score += 15
    if features["alcohol"]:
        score += 5

    # Chronic conditions
    score += features["has_diabetes"] * 15
    score += features["has_hypertension"] * 10
    score += features["has_cholesterol"] * 8
    score += features["has_heart"] * 18

    # Family history
    score += features["family_diabetes"] * 6
    score += features["family_hypertension"] * 4

    # Cap
    score = min(max(round(score, 1), 0), 100)
    tier = _score_to_tier(score)

    return score, tier


def _score_to_tier(score: float) -> str:
    if score >= 60:
        return "High"
    elif score >= 35:
        return "Moderate"
    else:
        return "Low"
