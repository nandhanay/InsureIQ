from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.sql import func
from core.database import Base


class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    extracted_values = Column(JSON, default={})
    confidence_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship(
        "UserProfile",
        back_populates="documents",
        primaryjoin="foreign(MedicalDocument.user_id) == UserProfile.user_id",
    )
