from sqlalchemy.orm import Session
from models.document import MedicalDocument
from typing import Dict, Any


def synthesize_clinical_profile(
    db: Session, user_id: int, fallback_values: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Synthesize a single clinical profile from all uploaded medical documents for a user.
    Uses a per-metric 'latest document wins' strategy.

    If no documents exist, falls back to fallback_values.
    """
    # Fetch all documents, ordered by created_at descending (latest first)
    documents = (
        db.query(MedicalDocument)
        .filter(MedicalDocument.user_id == user_id)
        .order_by(MedicalDocument.created_at.desc())
        .all()
    )

    metrics = [
        "hba1c",
        "glucose",
        "bloodPressure",
        "cholesterol",
        "hdl",
        "ldl",
        "creatinine",
        "haemoglobin",
    ]

    synthesized = {}

    # If no documents are found, return fallback_values or default empty structures
    if not documents:
        if fallback_values:
            return fallback_values
        return {
            metric: {"value": "Not found", "confidence": 0, "status": "normal"}
            for metric in metrics
        }

    # For each metric, find the latest document that has a valid extracted value (confidence > 0 and value != "Not found")
    for metric in metrics:
        metric_value = None
        for doc in documents:
            vals = doc.extracted_values or {}
            val_data = vals.get(metric)
            if val_data and isinstance(val_data, dict):
                confidence = val_data.get("confidence", 0)
                val_str = val_data.get("value", "Not found")
                # If we have a valid extraction
                if confidence > 0 and val_str != "Not found":
                    metric_value = val_data
                    break

        # If no valid document has this metric, use the fallback_value or the latest document's record
        if not metric_value:
            if fallback_values and metric in fallback_values:
                fb_data = fallback_values.get(metric)
                if (
                    fb_data
                    and isinstance(fb_data, dict)
                    and fb_data.get("confidence", 0) > 0
                ):
                    metric_value = fb_data

            if not metric_value and documents:
                latest_vals = documents[0].extracted_values or {}
                metric_value = latest_vals.get(
                    metric,
                    {"value": "Not found", "confidence": 0, "status": "normal"},
                )

        synthesized[metric] = metric_value

    return synthesized
