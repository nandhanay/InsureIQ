from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class IntakeSubmit(BaseModel):
    """Payload from the Intake Wizard form."""
    # Demographics
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=1, le=120)
    gender: str = Field(...)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    marital_status: str = Field(...)
    dependants: int = Field(default=0, ge=0)

    # Financial
    income_bracket: str = Field(...)
    existing_coverage: str = Field(...)
    monthly_budget: float = Field(default=1500, ge=0)

    # Health
    height: float = Field(..., ge=50, le=250, description="Height in cm")
    weight: float = Field(..., ge=10, le=300, description="Weight in kg")
    smoking: bool = False
    alcohol: bool = False
    chronic_conditions: List[str] = []
    family_history: List[str] = []
    past_surgeries: str = ""

    # Documents
    documents_uploaded: bool = False

    @field_validator('name', 'city', 'state', 'gender', 'marital_status', mode='before')
    @classmethod
    def strip_strings(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v



class RiskFactor(BaseModel):
    label: str
    value: float


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    name: str
    age: int
    gender: str
    city: str
    state: str
    marital_status: str
    dependants: int
    income_bracket: str
    existing_coverage: str
    monthly_budget: float
    height: float
    weight: float
    bmi: float
    smoking: bool
    alcohol: bool
    chronic_conditions: List[str]
    family_history: List[str]
    past_surgeries: str
    risk_score: float
    risk_tier: str
    risk_factors: List[RiskFactor]
    extracted_values: Optional[dict] = {}

    class Config:
        from_attributes = True
