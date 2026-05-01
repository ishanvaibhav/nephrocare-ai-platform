from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat, labs, diet, risk, meds, wellness, progress

app = FastAPI(title="NephroCare AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NephroCare AI backend is running. Visit /docs for API docs."}

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(labs.router, prefix="/api/labs", tags=["labs"])
app.include_router(diet.router, prefix="/api/diet", tags=["diet"])
app.include_router(risk.router, prefix="/api/risk", tags=["risk"])
app.include_router(meds.router, prefix="/api/meds", tags=["meds"])
app.include_router(wellness.router, prefix="/api/wellness", tags=["wellness"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
