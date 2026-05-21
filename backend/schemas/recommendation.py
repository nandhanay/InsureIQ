from pydantic import BaseModel
from typing import List, Optional


class SuitabilityDimension(BaseModel):
    label: str
    score: int


class RejectionRisk(BaseModel):
    label: str  # Low, Moderate, High
    score: int


class Warning(BaseModel):
    type: str
    severity: str  # low, medium, high, critical
    message: str


class SHAPFactor(BaseModel):
    label: str
    value: float


class PremiumForecast(BaseModel):
    year: int
    premium: float


class RecommendationCard(BaseModel):
    """Matches frontend PlanCardData interface exactly."""
    id: str
    rank: int
    planName: str
    insurer: str
    planType: str
    suitabilityScore: int
    suitabilityBreakdown: List[SuitabilityDimension]
    modelConfidence: int
    rejectionRisk: RejectionRisk
    warnings: List[Warning]
    shapFactors: List[SHAPFactor]
    explanationText: str
    premiumMin: float
    premiumMax: float
    csr: float
    premiumForecast: List[PremiumForecast]
    isWatchlisted: Optional[bool] = False


class RecommendationsResponse(BaseModel):
    risk_score: float
    risk_tier: str
    risk_factors: List[SHAPFactor]
    recommendations: List[RecommendationCard]
