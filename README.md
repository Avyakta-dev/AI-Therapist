# AI Therapist 💬🧠

A friendly AI-powered therapist chatbot built with React and FastAPI to support mental wellness conversations in a Gen Z–friendly vibe.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, Vite  
- **Backend**: Python, FastAPI, Novita AI API

## 🚀 Deployment

### Backend (Render)

Create a Web Service with Root Directory `backend`.

- Runtime: Python 3.13
- Build Command: `pip install --upgrade pip setuptools wheel && pip install -r requirements.txt`
- Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/health`

Environment variables:

- `NOVITA_API_KEY`: your Novita/OpenAI-compatible API key

This is also captured in `render.yaml` for Infrastructure as Code.

### Frontend (Vercel)

Deploy the `frontend` directory.

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variables:

- `VITE_API_BASE_URL`: `https://YOUR-RENDER-SERVICE.onrender.com`

