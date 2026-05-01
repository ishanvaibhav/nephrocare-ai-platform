from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from uuid import uuid4

router = APIRouter()


class Med(BaseModel):
    id: str
    name: str
    dose: str
    schedule: str  # e.g. "1-0-1", "OD", "HS"


class MedCreate(BaseModel):
    name: str
    dose: str
    schedule: str


MEDS_DB: List[Med] = []  # in-memory demo storage


@router.get("", response_model=List[Med])
async def list_meds():
    return MEDS_DB


@router.post("", response_model=Med)
async def add_med(body: MedCreate):
    med = Med(id=str(uuid4()), **body.dict())
    MEDS_DB.append(med)
    return med


@router.delete("/{med_id}")
async def delete_med(med_id: str):
    global MEDS_DB
    before = len(MEDS_DB)
    MEDS_DB = [m for m in MEDS_DB if m.id != med_id]
    if len(MEDS_DB) == before:
        raise HTTPException(status_code=404, detail="Medication not found")
    return {"ok": True}
