"""
Document Upload & Extraction Router
Handles medical report uploads and Gemini-based clinical data extraction.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from core.database import get_db
from middleware.auth import get_current_user
from models.user import User
from models.profile import UserProfile
from services.gemini_service import extract_medical_values

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/extract")
async def extract_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a medical report (PDF/JPG/PNG) and extract clinical lab values
    using Gemini AI. Returns structured data with confidence scores.
    """
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
            detail=f"File too large. Maximum size is 10MB."
        )

    # Extract medical values
    extracted = await extract_medical_values(
        file_content=content,
        filename=file.filename or "document.pdf",
        content_type=content_type,
    )

    # Save extracted values to user profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile:
        profile.extracted_values = extracted
        profile.documents_uploaded = True
        db.commit()

    return extracted
