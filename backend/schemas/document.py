from pydantic import BaseModel
from typing import Optional, Dict


class ExtractedLabValue(BaseModel):
    value: str
    confidence: int
    status: str  # normal, elevated, high, low


class ExtractionResponse(BaseModel):
    """Matches frontend mockExtractedValues structure."""
    hba1c: Optional[ExtractedLabValue] = None
    glucose: Optional[ExtractedLabValue] = None
    bloodPressure: Optional[ExtractedLabValue] = None
    cholesterol: Optional[ExtractedLabValue] = None
    hdl: Optional[ExtractedLabValue] = None
    ldl: Optional[ExtractedLabValue] = None
    creatinine: Optional[ExtractedLabValue] = None
    haemoglobin: Optional[ExtractedLabValue] = None
