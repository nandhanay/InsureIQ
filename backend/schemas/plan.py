from pydantic import BaseModel
from typing import List, Optional


class PlanResponse(BaseModel):
    """Matches frontend Plan interface in mockPlans.ts."""
    id: str
    name: str
    insurer: str
    planType: str
    premiumMin: float
    premiumMax: float
    coverage: str
    coverageAmount: float
    csr: float
    waitingPeriodDays: int
    roomRent: str
    coPay: str
    day1Conditions: List[str]
    exclusions: List[str]
    pros: List[str]
    cons: List[str]
    features: List[str]

    class Config:
        from_attributes = True
