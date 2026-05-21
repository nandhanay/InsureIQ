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


class ProfileCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=1, le=120)
    gender: str = Field(...)
    height: float = Field(..., ge=50, le=250, description="Height in cm")
    weight: float = Field(..., ge=10, le=300, description="Weight in kg")
    bmi: Optional[float] = None
    smoking_status: bool = False
    alcohol_consumption: bool = False
    chronic_conditions: List[str] = []
    family_history: List[str] = []

    # Optional compatibility fields
    city: Optional[str] = "Unknown"
    state: Optional[str] = "Unknown"
    marital_status: Optional[str] = "Single"
    dependants: Optional[int] = 0
    income_bracket: Optional[str] = "None"
    existing_coverage: Optional[str] = "None"
    monthly_budget: Optional[float] = 1500.0
    past_surgeries: Optional[str] = ""


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    smoking_status: Optional[bool] = None
    alcohol_consumption: Optional[bool] = None
    chronic_conditions: Optional[List[str]] = None
    family_history: Optional[List[str]] = None

    # Optional compatibility fields
    city: Optional[str] = None
    state: Optional[str] = None
    marital_status: Optional[str] = None
    dependants: Optional[int] = None
    income_bracket: Optional[str] = None
    existing_coverage: Optional[str] = None
    monthly_budget: Optional[float] = None
    past_surgeries: Optional[str] = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: Optional[str] = None
    name: Optional[str] = None  # UI compatibility
    age: int
    gender: str
    city: Optional[str] = "Unknown"
    state: Optional[str] = "Unknown"
    marital_status: Optional[str] = "Single"
    dependants: Optional[int] = 0
    income_bracket: Optional[str] = "None"
    existing_coverage: Optional[str] = "None"
    monthly_budget: Optional[float] = 1500
    height: float
    weight: float
    bmi: float
    smoking: bool
    smoking_status: bool
    alcohol: bool
    alcohol_consumption: bool
    chronic_conditions: List[str]
    family_history: List[str]
    past_surgeries: Optional[str] = ""
    risk_score: float
    risk_tier: str
    risk_factors: List[RiskFactor]
    extracted_values: Optional[dict] = {}
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

