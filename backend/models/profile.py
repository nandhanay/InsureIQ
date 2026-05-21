from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from core.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)

    # Demographics
    age = Column(Integer)
    gender = Column(String)
    city = Column(String)
    state = Column(String)
    marital_status = Column(String)
    dependants = Column(Integer, default=0)

    # Financial
    income_bracket = Column(String)
    existing_coverage = Column(String)
    monthly_budget = Column(Float, default=1500)

    # Health
    height = Column(Float)
    weight = Column(Float)
    bmi = Column(Float)
    smoking = Column(Boolean, default=False)
    alcohol = Column(Boolean, default=False)
    chronic_conditions = Column(JSON, default=[])
    family_history = Column(JSON, default=[])
    past_surgeries = Column(String, default="")

    # Documents
    documents_uploaded = Column(Boolean, default=False)
    extracted_values = Column(JSON, default={})

    # ML Outputs
    risk_score = Column(Float, default=0)
    risk_tier = Column(String, default="Low")  # Low, Moderate, High
    risk_factors = Column(JSON, default=[])     # SHAP factors list

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
