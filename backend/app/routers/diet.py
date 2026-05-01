from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from ..openai_client import chat_completion

router = APIRouter()


class DietRequest(BaseModel):
    stage: str
    vegetarian: bool = True
    calories: int = 1800
    age: Optional[int] = None
    diabetes: bool = False
    hypertension: bool = False
    region: Optional[str] = None  # e.g. "north indian", "south indian"
    notes: Optional[str] = None


class Meal(BaseModel):
    name: str
    items: List[str]


class DietPlan(BaseModel):
    summary: str
    calories: int
    protein_grams: int
    sodium_mg: int
    potassium_mg: int
    phosphorus_mg: int
    meals: List[Meal]


@router.post("/plan", response_model=DietPlan)
async def plan_diet(body: DietRequest):
    veg = "vegetarian" if body.vegetarian else "non-vegetarian"
    comorbidities = []
    if body.diabetes:
        comorbidities.append("diabetes")
    if body.hypertension:
        comorbidities.append("hypertension")
    comorbid_str = ", ".join(comorbidities) if comorbidities else "none"

    extra = []
    if body.age:
        extra.append(f"Age: {body.age}")
    if body.region:
        extra.append(f"Preferred style: {body.region}")
    if body.notes:
        extra.append(f"Extra notes: {body.notes}")
    extra_text = "\n".join(extra)

    prompt = f"""Create a renal-friendly {veg} diet plan for a CKD stage {body.stage} patient.

Daily calories target: {body.calories}.
Comorbidities: {comorbid_str}.

Constraints:
- Respect CKD restrictions for sodium, potassium, and phosphorus.
- Adjust carbs for diabetes if present.
- Avoid very salty or processed food.
- Use Indian-style meals where possible.
{extra_text}

Return JSON with:
- summary
- calories
- protein_grams
- sodium_mg
- potassium_mg
- phosphorus_mg
- meals: list of {{name, items: [strings]}}.
"""

    try:
        completion = chat_completion(
            [
                {"role": "system", "content": "You are an experienced renal dietitian."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
        )
        data = completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    import json

    try:
        parsed = json.loads(data)
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    return DietPlan(**parsed)
