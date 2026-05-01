from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pypdf import PdfReader
from io import BytesIO
import base64
import json

from ..openai_client import chat_completion

router = APIRouter()


# ---------- Pydantic models ----------

class LabItem(BaseModel):
  name: str
  value: str
  units: Optional[str] = None
  ref_range: Optional[str] = None
  status: Optional[str] = None   # "low" | "normal" | "high"
  system: Optional[str] = None   # "kidney", "blood", "metabolic", etc.


class LabAnalysis(BaseModel):
  summary: str
  stage_guess: Optional[str] = None
  labs: List[LabItem]
  severity_score: int            # 0–100
  risk_band: str                 # "low" | "moderate" | "high"
  next_steps: str


# ---------- Helpers ----------

def extract_text_from_pdf(data: bytes) -> str:
  """Extract text from all pages of a PDF."""
  try:
    reader = PdfReader(BytesIO(data))
    chunks = []
    for page in reader.pages:
      chunks.append(page.extract_text() or "")
    return "\n".join(chunks)
  except Exception as e:
    raise HTTPException(status_code=400, detail=f"Could not read PDF: {e}")


BASE_PROMPT = """
You are a nephrologist reading a patient's lab report.

1. Extract ALL lab parameters you can identify, especially:
   - Kidney: creatinine, eGFR, urea/BUN, potassium, sodium, albumin, urine protein, UACR, etc.
   - Metabolic: HbA1c, fasting glucose, lipids.
   - Blood: hemoglobin, WBC, platelets.

2. For each test, return:
   - name
   - value
   - units (if known)
   - ref_range (if visible, else null)
   - status: "low", "normal", or "high"
   - system: e.g. "kidney", "liver", "blood", "metabolic".

3. Provide:
   - summary: max 5 bullet points, patient-friendly.
   - stage_guess: CKD stage 1–5 if you can infer; else null.
   - severity_score: integer 0–100 (0 very safe, 100 very dangerous for kidneys).
   - risk_band: "low", "moderate", or "high".
   - next_steps: 2–4 practical suggestions.

Return ONE JSON object with keys:
summary, stage_guess, severity_score, risk_band, next_steps, labs (list of tests).
""".strip()


# ---------- Endpoint ----------

@router.post("/upload", response_model=LabAnalysis)
async def upload_lab(file: UploadFile = File(...)):
  """
  Accepts a lab report as PDF, image (jpg/png) or text file and returns
  structured CKD-focused analysis using the OpenAI deployment.
  """
  content = await file.read()
  if not content:
    raise HTTPException(status_code=400, detail="Empty file")

  ct = (file.content_type or "").lower()
  filename = (file.filename or "").lower()

  mode = "text"
  raw_text = ""
  image_payload = None

  # 👉 PDF → extract text with pypdf
  if filename.endswith(".pdf") or ct == "application/pdf":
    raw_text = extract_text_from_pdf(content)

  # 👉 Image (jpg/png etc.) → send as vision input
  elif ct.startswith("image/"):
    mode = "image"
    b64 = base64.b64encode(content).decode("utf-8")
    image_payload = f"data:{ct};base64,{b64}"

  # 👉 Everything else → treat as plain text
  else:
    try:
      raw_text = content.decode(errors="ignore")
    except Exception as e:
      raise HTTPException(status_code=400, detail=f"Could not read file: {e}")

  # Build messages for OpenAI
  if mode == "text":
    user_content = BASE_PROMPT + "\n\nLab report text:\n" + raw_text
    messages = [
      {
        "role": "system",
        "content": "You convert lab reports to structured JSON for CKD and related health issues.",
      },
      {"role": "user", "content": user_content},
    ]
  else:  # image mode
    messages = [
      {
        "role": "system",
        "content": "You read image-based lab reports and convert them to structured JSON focused on CKD.",
      },
      {
        "role": "user",
        "content": [
          {"type": "text", "text": BASE_PROMPT},
          {"type": "image_url", "image_url": {"url": image_payload}},
        ],
      },
    ]

  # Call Azure OpenAI via our shared helper
  try:
    completion = chat_completion(
      messages,
      response_format={"type": "json_object"},
    )
    data = completion.choices[0].message.content
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

  # Parse JSON from the model
  try:
    parsed = json.loads(data)
  except Exception:
    raise HTTPException(status_code=500, detail="AI returned invalid JSON")

  # Safety defaults
  if "severity_score" not in parsed:
    parsed["severity_score"] = 0
  if "risk_band" not in parsed:
    parsed["risk_band"] = "low"
  if "labs" not in parsed:
    parsed["labs"] = []

  return LabAnalysis(**parsed)
