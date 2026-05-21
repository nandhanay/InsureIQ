from pydantic import BaseModel
from typing import List, Optional


class ForecastDataPoint(BaseModel):
    year: int
    premium: float


class PlanForecast(BaseModel):
    """Matches frontend PlanForecast interface in mockForecast.ts."""
    planId: str
    planName: str
    insurer: str
    color: str
    data: List[ForecastDataPoint]


class ForecastResponse(BaseModel):
    forecasts: List[PlanForecast]


class SimulateRequest(BaseModel):
    income: str = "10-20"
    new_condition: str = ""
    coverage_increase: float = 0


class SimulatedResult(BaseModel):
    plan: str
    original: float
    simulated: float
    change: str


class SimulateResponse(BaseModel):
    results: List[SimulatedResult]
    warning: Optional[str] = None
