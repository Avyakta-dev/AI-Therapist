from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot import ask_therapist_novita
import os

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set to your localhost only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_input: str

@app.post("/chat")
async def chat(req: ChatRequest):
    # Fallback to a friendly mock when NOVITA_API_KEY is not set so the app works out of the box
    if not os.getenv("NOVITA_API_KEY"):
        return {
            "reply": (
                "low-key hear you. that’s a lot — try one tiny thing rn that helps (water, 5 deep breaths, or a 5‑min walk). you got this ✨"
            )
        }

    reply = ask_therapist_novita(req.user_input)
    return {"reply": reply}

@app.get("/health")
async def health():
    return {"status": "ok"}
