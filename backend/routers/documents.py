"""
Document Upload & Extraction Router
Handles medical report uploads, replacement, deletion, listing, and Gemini-based clinical data extraction.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from models.document import MedicalDocument
from services.gemini_service import extract_medical_values

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def format_document_response(doc: MedicalDocument) -> dict:
    """Format document DB object into a clean dictionary response."""
    return {
        "id": doc.id,
        "user_id": doc.user_id,
        "filename": doc.filename,
        "extracted_values": doc.extracted_values or {},
        "confidence_score": doc.confidence_score,
        "created_at": doc.created_at.isoformat() if doc.created_at else None,
    }


def recalculate_user_risk(db: Session, user_id: int):
    """Recalculate user profile risk parameters using all synthesized medical documents."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        return

    # Check document count
    docs_count = db.query(MedicalDocument).filter(MedicalDocument.user_id == user_id).count()
    profile.documents_uploaded = docs_count > 0

    # Synthesize clinical profile
    from services.clinical_aggregator import synthesize_clinical_profile
    synthesized_profile = synthesize_clinical_profile(db, user_id, profile.extracted_values)

    # Build profile dict for ML
    from services.ml_service import predict_risk
    from services.shap_service import compute_shap_factors
    profile_dict = {
        "age": profile.age,
        "bmi": profile.bmi,
        "height": profile.height,
        "weight": profile.weight,
        "smoking": profile.smoking_status,
        "alcohol": profile.alcohol_consumption,
        "chronic_conditions": profile.chronic_conditions or [],
        "family_history": profile.family_history or [],
        "city": profile.city or "Unknown",
        "extracted_values": synthesized_profile,
    }

    # Predict risk & SHAP factors
    risk_score, risk_tier = predict_risk(profile_dict)
    risk_factors = compute_shap_factors(profile_dict)

    # Update profile
    profile.risk_score = risk_score
    profile.risk_tier = risk_tier
    profile.risk_factors = risk_factors

    db.commit()
    db.refresh(profile)


async def process_and_save_document(file: UploadFile, user_id: int, db: Session) -> MedicalDocument:
    """Validate, extract data using Gemini, save to DB, and trigger risk recalculation."""
    # Validate file type
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {content_type}. Allowed: PDF, JPG, PNG."
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 10MB."
        )

    # Extract medical values
    extracted = await extract_medical_values(
        file_content=content,
        filename=file.filename or "document.pdf",
        content_type=content_type,
    )

    # Calculate average confidence score
    conf_scores = [val.get("confidence", 0) for val in extracted.values() if isinstance(val, dict)]
    avg_conf = sum(conf_scores) / len(conf_scores) if conf_scores else 0.0

    # Save to database
    doc = MedicalDocument(
        user_id=user_id,
        filename=file.filename or "document.pdf",
        extracted_values=extracted,
        confidence_score=avg_conf,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Recalculate user risk
    recalculate_user_risk(db, user_id)

    return doc


@router.post("/extract")
async def extract_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a medical report and extract clinical lab values.
    Saves to the MedicalDocument table and recalculates user risk.
    """
    doc = await process_and_save_document(file, current_user.id, db)
    return format_document_response(doc)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a medical report.
    Saves to the MedicalDocument table and recalculates user risk.
    """
    doc = await process_and_save_document(file, current_user.id, db)
    return format_document_response(doc)


@router.get("")
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all medical documents uploaded by the authenticated user."""
    docs = (
        db.query(MedicalDocument)
        .filter(MedicalDocument.user_id == current_user.id)
        .order_by(MedicalDocument.created_at.desc())
        .all()
    )
    return [format_document_response(d) for d in docs]


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a medical document and trigger profile risk recalculation."""
    doc = (
        db.query(MedicalDocument)
        .filter(MedicalDocument.id == document_id, MedicalDocument.user_id == current_user.id)
        .first()
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    db.delete(doc)
    db.commit()

    # Recalculate user risk
    recalculate_user_risk(db, current_user.id)

    return {"message": "Document deleted successfully"}


@router.put("/{document_id}")
async def replace_document(
    document_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Replace an existing medical document with a new upload and trigger risk recalculation."""
    doc = (
        db.query(MedicalDocument)
        .filter(MedicalDocument.id == document_id, MedicalDocument.user_id == current_user.id)
        .first()
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # Validate file type
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {content_type}. Allowed: PDF, JPG, PNG."
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 10MB."
        )

    # Extract medical values
    extracted = await extract_medical_values(
        file_content=content,
        filename=file.filename or "document.pdf",
        content_type=content_type,
    )

    # Calculate average confidence score
    conf_scores = [val.get("confidence", 0) for val in extracted.values() if isinstance(val, dict)]
    avg_conf = sum(conf_scores) / len(conf_scores) if conf_scores else 0.0

    # Update document details
    doc.filename = file.filename or "document.pdf"
    doc.extracted_values = extracted
    doc.confidence_score = avg_conf

    # Update timestamp
    from sqlalchemy.sql import func
    doc.created_at = func.now()

    db.commit()
    db.refresh(doc)

    # Recalculate user risk
    recalculate_user_risk(db, current_user.id)

    return format_document_response(doc)

