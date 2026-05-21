from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class WatchlistToggle(BaseModel):
    plan_id: str


class WatchlistChange(BaseModel):
    type: str       # premium, csr, exclusion, metric
    direction: str  # up, down, neutral
    label: str
    detail: str
    timestamp: str


class WatchlistPlanItem(BaseModel):
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
    addedAt: Optional[str] = None


class WatchlistChangeGroup(BaseModel):
    planName: str
    insurer: str
    changes: List[WatchlistChange]


class WatchlistResponse(BaseModel):
    plans: List[WatchlistPlanItem]
    changes: List[WatchlistChangeGroup]
