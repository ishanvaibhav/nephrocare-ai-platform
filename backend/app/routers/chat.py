from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal

from ..openai_client import chat_completion

router = APIRouter()


class HistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[HistoryItem] = []  # optional short history


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = (
    "You are NephroCare, an AI assistant for chronic kidney disease (CKD). "
    "Always:\n"
    "- Use simple language for patients.\n"
    "- Explain what lab values roughly mean (high/low/normal) but avoid strict diagnosis.\n"
    "- Encourage user to share their lab values, symptoms, diet, and medications.\n"
    "- At the end of each answer, add one short, practical next step.\n"
    "- Always recommend follow-up with a nephrologist for real medical decisions."
)


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(body: ChatRequest):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        # Include a bit of history for more dynamic, contextual replies
        for h in body.history[-6:]:
            messages.append({"role": h.role, "content": h.content})
        messages.append({"role": "user", "content": body.message})

        completion = chat_completion(messages)
        reply = completion.choices[0].message.content
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
