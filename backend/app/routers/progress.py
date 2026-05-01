from fastapi import APIRouter
from pydantic import BaseModel
from typing import List


router = APIRouter()


class TrendPoint(BaseModel):
    date: str
    egfr: float
    creatinine: float


class ProgressSummary(BaseModel):
    summary: str
    trends: List[TrendPoint]


@router.get("", response_model=ProgressSummary)
async def get_progress():
    # demo static data; in a real app this would come from DB
    data = ProgressSummary(
        summary=(
            "Your kidney function has been relatively stable over the last few months "
            "with mild CKD (around stage 3). Keep following your diet, medications, and "
            "regular follow-up with your nephrologist."
        ),
        trends=[
            TrendPoint(date="2025-01-01", egfr=58, creatinine=1.3),
            TrendPoint(date="2025-03-01", egfr=56, creatinine=1.35),
            TrendPoint(date="2025-05-01", egfr=57, creatinine=1.32),
            TrendPoint(date="2025-07-01", egfr=55, creatinine=1.38),
        ],
    )
    return data
