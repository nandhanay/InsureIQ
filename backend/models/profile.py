from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import synonym, relationship, foreign
from sqlalchemy.sql import func
from core.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)

    # Demographics
    full_name = Column(String, nullable=True)
    age = Column(Integer)
    gender = Column(String)
    city = Column(String, default="Unknown")
    state = Column(String, default="Unknown")
    marital_status = Column(String, default="Single")
    dependants = Column(Integer, default=0)

    # Financial
    income_bracket = Column(String, default="None")
    existing_coverage = Column(String, default="None")
    monthly_budget = Column(Float, default=1500)

    # Health
    height = Column(Float)
    weight = Column(Float)
    bmi = Column(Float)
    
    # Smoking and Alcohol with synonym mapping for spec compliance and backwards compatibility
    smoking_status = Column(Boolean, default=False, nullable=False)
    smoking = synonym("smoking_status")

    alcohol_consumption = Column(Boolean, default=False, nullable=False)
    alcohol = synonym("alcohol_consumption")

    chronic_conditions = Column(JSON, default=[])
    family_history = Column(JSON, default=[])
    past_surgeries = Column(String, default="")

    # Documents
    documents_uploaded = Column(Boolean, default=False)
    extracted_values = Column(JSON, default={})
    
    documents = relationship(
        "MedicalDocument",
        back_populates="profile",
        primaryjoin="UserProfile.user_id == foreign(MedicalDocument.user_id)",
        cascade="all, delete-orphan",
    )

    # ML Outputs
    risk_score = Column(Float, default=0)
    risk_tier = Column(String, default="Low")  # Low, Moderate, High
    risk_factors = Column(JSON, default=[])     # SHAP factors list

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

