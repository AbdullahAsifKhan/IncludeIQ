from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from services.ai_service import analyze_text

# Ensure the parent directory's .env is loaded
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="IncludeIQ Backend")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

@app.post("/api/analyze")
async def analyze_document(payload: TextPayload):
    # For MVP, we'll accept plain text instead of PDFs to simplify.
    result = await analyze_text(payload.text)
    return result

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
