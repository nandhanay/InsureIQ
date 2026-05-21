"""
Profile & Intake Router
Handles user profile creation, retrieval, and updates with ML risk recalculations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from schemas.profile import IntakeSubmit, ProfileResponse, ProfileCreate, ProfileUpdate
from services.ml_service import predict_risk, _calculate_bmi
from services.shap_service import compute_shap_factors

router = APIRouter()


def format_profile_response(profile: UserProfile, user_full_name: str, db: Session = None) -> dict:
    """Format profile DB object into a highly compatible response dictionary supporting snake and camelCase."""
    name_val = profile.full_name or user_full_name

    extracted = profile.extracted_values or {}
    if db:
        from services.clinical_aggregator import synthesize_clinical_profile
        extracted = synthesize_clinical_profile(db, profile.user_id, profile.extracted_values)

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "name": name_val,
        "full_name": name_val,
        "age": profile.age,
        "gender": profile.gender,
        "city": profile.city or "Unknown",
        "state": profile.state or "Unknown",
        "maritalStatus": profile.marital_status or "Single",
        "marital_status": profile.marital_status or "Single",
        "dependants": profile.dependants or 0,
        "incomeBracket": profile.income_bracket or "None",
        "income_bracket": profile.income_bracket or "None",
        "existingCoverage": profile.existing_coverage or "None",
        "existing_coverage": profile.existing_coverage or "None",
        "monthlyBudget": profile.monthly_budget or 1500.0,
        "monthly_budget": profile.monthly_budget or 1500.0,
        "height": profile.height,
        "weight": profile.weight,
        "bmi": profile.bmi,
        "smoking": profile.smoking_status,
        "smoking_status": profile.smoking_status,
        "alcohol": profile.alcohol_consumption,
        "alcohol_consumption": profile.alcohol_consumption,
        "chronicConditions": profile.chronic_conditions or [],
        "chronic_conditions": profile.chronic_conditions or [],
        "familyHistory": profile.family_history or [],
        "family_history": profile.family_history or [],
        "pastSurgeries": profile.past_surgeries or "",
        "past_surgeries": profile.past_surgeries or "",
        "riskScore": profile.risk_score,
        "risk_score": profile.risk_score,
        "riskTier": profile.risk_tier,
        "risk_tier": profile.risk_tier,
        "riskFactors": profile.risk_factors or [],
        "risk_factors": profile.risk_factors or [],
        "extractedValues": extracted,
        "extracted_values": extracted,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_profile(
    data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create user profile, calculate BMI, run ML risk models, and return profile."""
    # Check if profile already exists
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user. Use PUT /profile/update to modify."
        )

    # Calculate BMI
    bmi = data.bmi if data.bmi is not None else _calculate_bmi(data.height, data.weight)

    # Check for uploaded documents
    from models.document import MedicalDocument
    from services.clinical_aggregator import synthesize_clinical_profile
    docs_count = db.query(MedicalDocument).filter(MedicalDocument.user_id == current_user.id).count()
    synthesized_profile = synthesize_clinical_profile(db, current_user.id, {})

    # Build profile dict for ML
    profile_dict = {
        "age": data.age,
        "bmi": bmi,
        "height": data.height,
        "weight": data.weight,
        "smoking": data.smoking_status,
        "alcohol": data.alcohol_consumption,
        "chronic_conditions": data.chronic_conditions,
        "family_history": data.family_history,
        "city": data.city or "Unknown",
        "extracted_values": synthesized_profile,
    }

    # Predict risk & SHAP factors
    risk_score, risk_tier = predict_risk(profile_dict)
    risk_factors = compute_shap_factors(profile_dict)

    # Create profile
    profile = UserProfile(
        user_id=current_user.id,
        full_name=data.full_name,
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
        smoking_status=data.smoking_status,
        alcohol_consumption=data.alcohol_consumption,
        chronic_conditions=data.chronic_conditions,
        family_history=data.family_history,
        past_surgeries=data.past_surgeries,
        documents_uploaded=docs_count > 0,
        risk_score=risk_score,
        risk_tier=risk_tier,
        risk_factors=risk_factors,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return format_profile_response(profile, current_user.full_name, db)


@router.put("/update")
async def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile, recalculate BMI and ML risk tier if health metrics change."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete the profile setup first."
        )

    # Update fields
    if data.full_name is not None:
        profile.full_name = data.full_name
    if data.age is not None:
        profile.age = data.age
    if data.gender is not None:
        profile.gender = data.gender
    if data.city is not None:
        profile.city = data.city
    if data.state is not None:
        profile.state = data.state
    if data.marital_status is not None:
        profile.marital_status = data.marital_status
    if data.dependants is not None:
        profile.dependants = data.dependants
    if data.income_bracket is not None:
        profile.income_bracket = data.income_bracket
    if data.existing_coverage is not None:
        profile.existing_coverage = data.existing_coverage
    if data.monthly_budget is not None:
        profile.monthly_budget = data.monthly_budget
    if data.height is not None:
        profile.height = data.height
    if data.weight is not None:
        profile.weight = data.weight
    if data.smoking_status is not None:
        profile.smoking_status = data.smoking_status
    if data.alcohol_consumption is not None:
        profile.alcohol_consumption = data.alcohol_consumption
    if data.chronic_conditions is not None:
        profile.chronic_conditions = data.chronic_conditions
    if data.family_history is not None:
        profile.family_history = data.family_history
    if data.past_surgeries is not None:
        profile.past_surgeries = data.past_surgeries

    # Recalculate BMI
    if data.bmi is not None:
        profile.bmi = data.bmi
    elif data.height is not None or data.weight is not None:
        profile.bmi = _calculate_bmi(profile.height, profile.weight)

    # Trigger ML Recalculation
    from services.clinical_aggregator import synthesize_clinical_profile
    synthesized_profile = synthesize_clinical_profile(db, profile.user_id, profile.extracted_values)

    profile_dict = {
        "age": profile.age,
        "bmi": profile.bmi,
        "height": profile.height,
        "weight": profile.weight,
        "smoking": profile.smoking_status,
        "alcohol": profile.alcohol_consumption,
        "chronic_conditions": profile.chronic_conditions,
        "family_history": profile.family_history,
        "city": profile.city or "Unknown",
        "extracted_values": synthesized_profile,
    }
    risk_score, risk_tier = predict_risk(profile_dict)
    risk_factors = compute_shap_factors(profile_dict)

    profile.risk_score = risk_score
    profile.risk_tier = risk_tier
    profile.risk_factors = risk_factors

    db.commit()
    db.refresh(profile)

    return format_profile_response(profile, current_user.full_name, db)


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
            detail="Profile not found. Please complete the profile setup first."
        )

    return format_profile_response(profile, current_user.full_name, db)


@router.post("/intake", status_code=status.HTTP_201_CREATED)
async def submit_intake(
    data: IntakeSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit intake wizard data, run ML risk prediction, and create/update profile."""
    # Calculate BMI
    bmi = _calculate_bmi(data.height, data.weight)

    # Check for uploaded documents
    from models.document import MedicalDocument
    from services.clinical_aggregator import synthesize_clinical_profile
    docs_count = db.query(MedicalDocument).filter(MedicalDocument.user_id == current_user.id).count()
    documents_uploaded = docs_count > 0 or data.documents_uploaded
    synthesized_profile = {}
    if docs_count > 0:
        synthesized_profile = synthesize_clinical_profile(db, current_user.id, {})

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
        "extracted_values": synthesized_profile,
    }

    # Run risk prediction
    risk_score, risk_tier = predict_risk(profile_dict)

    # Compute SHAP factors
    risk_factors = compute_shap_factors(profile_dict)

    # Check if profile exists
    existing = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if existing:
        # Update existing profile
        existing.full_name = data.name
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
        existing.smoking_status = data.smoking
        existing.alcohol_consumption = data.alcohol
        existing.chronic_conditions = data.chronic_conditions
        existing.family_history = data.family_history
        existing.past_surgeries = data.past_surgeries
        existing.documents_uploaded = documents_uploaded
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
            full_name=data.name,
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
            smoking_status=data.smoking,
            alcohol_consumption=data.alcohol,
            chronic_conditions=data.chronic_conditions,
            family_history=data.family_history,
            past_surgeries=data.past_surgeries,
            documents_uploaded=documents_uploaded,
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

