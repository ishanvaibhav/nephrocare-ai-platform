from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class RiskRequest(BaseModel):
    age: Optional[int] = None
    diabetes: bool = False
    hypertension: bool = False
    proteinuria: bool = False
    smoking: bool = False
    # Optional extra fields if you later want to send them from UI
    creatinine: Optional[float] = None
    uacr: Optional[float] = None


class RiskResponse(BaseModel):
    score: int          # 0–100
    risk_band: str      # "low", "moderate", "high"
    explanation: str
    followup: str


@router.post("/assess", response_model=RiskResponse)
async def assess_risk(body: RiskRequest):
    score = 10

    if body.age:
        if body.age >= 75:
            score += 25
        elif body.age >= 60:
            score += 15
        elif body.age >= 45:
            score += 8

    if body.diabetes:
        score += 20
    if body.hypertension:
        score += 15
    if body.proteinuria:
        score += 25
    if body.smoking:
        score += 10

    if body.creatinine and body.creatinine > 1.5:
        score += 10
    if body.uacr and body.uacr > 30:
        score += 10

    score = max(0, min(score, 100))

    if score < 30:
        band = "low"
        followup = "Annual review with labs is usually sufficient unless new symptoms appear."
    elif score < 60:
        band = "moderate"
        followup = "Repeat labs every 6–12 months and monitor blood pressure, sugar and urine protein."
    else:
        band = "high"
        followup = (
            "Needs close nephrology follow-up, typically every 3–6 months with "
            "aggressive control of blood pressure, diabetes and proteinuria."
        )

    explanation = (
        "This is a simplified educational risk score combining age, diabetes, "
        "hypertension, protein in urine and smoking. It is NOT a diagnostic tool "
        "and must not replace clinical judgement."
    )

    return RiskResponse(score=score, risk_band=band, explanation=explanation, followup=followup)
