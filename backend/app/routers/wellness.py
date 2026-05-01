from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..openai_client import client

router = APIRouter()


class WellnessRequest(BaseModel):
    message: str


class WellnessResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = (
    "You are a supportive mental wellness companion for CKD patients. "
    "You listen empathetically, validate feelings, and suggest simple coping strategies. "
    "You never give medical emergencies advice and always tell the user to contact local "
    "emergency services or doctors in crisis."
)


@router.post("/chat", response_model=WellnessResponse)
async def wellness_chat(body: WellnessRequest):
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": body.message},
            ],
        )
        reply = completion.choices[0].message.content
        return WellnessResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
