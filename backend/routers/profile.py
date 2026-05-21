"""
Profile & Intake Router
Handles user profile creation from the intake wizard and profile retrieval.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from schemas.profile import IntakeSubmit, ProfileResponse
from services.ml_service import predict_risk, _calculate_bmi
from services.shap_service import compute_shap_factors

router = APIRouter()


@router.post("/intake", status_code=status.HTTP_201_CREATED)
async def submit_intake(
    data: IntakeSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit intake wizard data, run ML risk prediction, and create/update profile."""
    # Calculate BMI
    bmi = _calculate_bmi(data.height, data.weight)

    # Build profile dict for ML
    profile_dict = {
        "age": data.age,
        "bmi": bmi,
        "height": data.height,
        "weight": data.weight,
        "smoking": data.smoking,
        "alcohol": data.alcohol,
        "chronic_conditions": data.chronic_conditions,
        "family_history": data.family_history,
        "city": data.city,
    }

    # Run risk prediction
    risk_score, risk_tier = predict_risk(profile_dict)

    # Compute SHAP factors
    risk_factors = compute_shap_factors(profile_dict)

    # Check if profile exists
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if existing:
        # Update existing profile
        existing.age = data.age
        existing.gender = data.gender
        existing.city = data.city
        existing.state = data.state
        existing.marital_status = data.marital_status
        existing.dependants = data.dependants
        existing.income_bracket = data.income_bracket
        existing.existing_coverage = data.existing_coverage
        existing.monthly_budget = data.monthly_budget
        existing.height = data.height
        existing.weight = data.weight
        existing.bmi = bmi
        existing.smoking = data.smoking
        existing.alcohol = data.alcohol
        existing.chronic_conditions = data.chronic_conditions
        existing.family_history = data.family_history
        existing.past_surgeries = data.past_surgeries
        existing.documents_uploaded = data.documents_uploaded
        existing.risk_score = risk_score
        existing.risk_tier = risk_tier
        existing.risk_factors = risk_factors
        db.commit()
        db.refresh(existing)
        profile = existing
    else:
        # Create new profile
        profile = UserProfile(
            user_id=current_user.id,
            age=data.age,
            gender=data.gender,
            city=data.city,
            state=data.state,
            marital_status=data.marital_status,
            dependants=data.dependants,
            income_bracket=data.income_bracket,
            existing_coverage=data.existing_coverage,
            monthly_budget=data.monthly_budget,
            height=data.height,
            weight=data.weight,
            bmi=bmi,
            smoking=data.smoking,
            alcohol=data.alcohol,
            chronic_conditions=data.chronic_conditions,
            family_history=data.family_history,
            past_surgeries=data.past_surgeries,
            documents_uploaded=data.documents_uploaded,
            risk_score=risk_score,
            risk_tier=risk_tier,
            risk_factors=risk_factors,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "message": "Profile saved and risk assessment completed",
        "risk_score": risk_score,
        "risk_tier": risk_tier,
        "risk_factors": risk_factors,
        "profile_id": profile.id,
    }


@router.get("/me")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's profile with risk assessment data."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete the intake form first."
        )

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "name": current_user.full_name,
        "age": profile.age,
        "gender": profile.gender,
        "city": profile.city,
        "state": profile.state,
        "maritalStatus": profile.marital_status,
        "dependants": profile.dependants,
        "incomeBracket": profile.income_bracket,
        "existingCoverage": profile.existing_coverage,
        "monthlyBudget": profile.monthly_budget,
        "height": profile.height,
        "weight": profile.weight,
        "bmi": profile.bmi,
        "smoking": profile.smoking,
        "alcohol": profile.alcohol,
        "chronicConditions": profile.chronic_conditions or [],
        "familyHistory": profile.family_history or [],
        "pastSurgeries": profile.past_surgeries or "",
        "riskScore": profile.risk_score,
        "riskTier": profile.risk_tier,
        "riskFactors": profile.risk_factors or [],
        "extractedValues": profile.extracted_values or {},
    }
