# Study Buddy Agent — Project Summary

## What Is This Project?

Study Buddy Agent is a **conversational AI chatbot** built as a full-stack web application. It allows a user to type Computer Science questions and receive clear, example-driven explanations from a Gemini-powered AI that acts as a peer tutor.

> **Honest scope:** This is a CS Q&A chatbot with a clean UI. It does NOT currently support document upload, note generation, or persistent chat history (history resets on browser refresh).

---

## Type of Project

| Layer | Technology | Role |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | User Interface |
| Backend | Python FastAPI + Uvicorn | API Server / Business Logic |
| AI Layer | Google Gemini 2.0 Flash | Intelligent Response Generation |
| Communication | REST API (HTTP/JSON) | Frontend ↔ Backend bridge |
| Validation | Pydantic v2 | Request/Response schema enforcement |
| Config | pydantic-settings + .env | Secret management |

This is a **Full-Stack Agentic AI Application** — specifically a RAG-less, single-agent, conversational assistant.

---

## Architecture — How It Works

```
User types message
       ↓
React Frontend (localhost:5173)
       ↓  HTTP POST /api/v1/chat/query
FastAPI Backend (localhost:8000)
       ↓  Pydantic validates request
StudyBuddyAgent (core/agent.py)
       ↓  Sends message + history
Google Gemini 2.0 Flash API
       ↓  Returns markdown response
FastAPI sends JSON response
       ↓
React renders markdown in chat bubble
       ↓
User sees reply + 1 conceptual question
```

---

## File Structure — What Each File Does

```
study-buddy-agent/
├── backend/
│   ├── app/
│   │   ├── main.py          ← FastAPI app entry point, CORS setup
│   │   ├── config.py        ← Loads .env secrets (API key, allowed origins)
│   │   ├── api/v1/
│   │   │   ├── router.py    ← Combines all sub-routers
│   │   │   └── chat.py      ← POST /api/v1/chat/query endpoint
│   │   ├── core/
│   │   │   └── agent.py     ← Gemini API logic + system prompt
│   │   └── schemas/
│   │       └── chat.py      ← Pydantic request/response models
│   ├── .env                 ← YOUR secrets (never commit this)
│   ├── .env.example         ← Template for others
│   └── requirements.txt     ← Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx           ← Root layout + state management
    │   ├── components/
    │   │   ├── ChatWindow.jsx ← Message list + input bar + markdown rendering
    │   │   ├── Sidebar.jsx    ← Session list + New Chat button
    │   │   └── Navbar.jsx     ← App title + status indicator
    │   ├── services/
    │   │   └── api.js         ← Axios instance → talks to backend
    │   └── index.css          ← Tailwind + Shadcn CSS variables
    ├── package.json           ← Node dependencies
    └── vite.config.js         ← Vite dev server config
```

---

## Key Features (What Actually Works)

| Feature | Status |
|---|---|
| Ask CS questions, get AI answers | ✅ Working |
| Markdown + code syntax highlighting in replies | ✅ Working |
| Gemini asks 1 conceptual question per reply | ✅ Working |
| Chat session saved in sidebar | ✅ Working (browser memory only) |
| Dark/Light mode toggle | ✅ Working |
| Collapsible sidebar | ✅ Working |
| Loading spinner while waiting for AI | ✅ Working |
| Document upload | ❌ Not implemented (placeholder only) |
| Persistent chat history (after refresh) | ❌ Not implemented |
| User authentication | ❌ Not implemented |

---

## What We Built & Fixed Today

### 1. Full Boilerplate Generated
Complete production-grade modular structure built from scratch — 15+ files across backend and frontend.

### 2. Python Dependency Conflict Fixed
**Problem:** `pydantic-core==2.7.4` had no prebuilt wheel for Python 3.14, causing a Rust build failure.
**Fix:** Removed pinned version numbers from `requirements.txt` and let pip resolve compatible versions automatically.
**Concept learned:** Python packaging, prebuilt wheels, version pinning.

### 3. Node.js Installed via Winget
**Problem:** Node.js was not installed, so `npm` command was not recognized.
**Fix:** Used `winget install OpenJS.NodeJS.LTS` to install Node.js via Windows package manager.
**Concept learned:** System PATH, environment configuration.

### 4. Gemini Model Version Fixed
**Problem:** `gemini-1.5-flash` returned 404 because Google deprecated it on the `v1beta` API endpoint.
**Fix:** Changed model to `gemini-2.0-flash` in `config.py`.
**Concept learned:** API versioning, model deprecation lifecycle.

---

## System Prompt — The AI's Personality

The Gemini agent is instructed to:
- Act as a **CS peer tutor**, not a formal teacher
- Always include **real-world examples or code snippets**
- Use **markdown formatting** for clarity
- End **every response** with exactly 1 conceptual question (💡 Think about this:)
- Stay focused on CS topics only

---

## How to Run (Every Time)

**Terminal 1 — Backend:**
```cmd
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```cmd
cd frontend
npm run dev
```

Open browser: `http://localhost:5173`

---

## What to Build Next (Roadmap)

| Feature | Complexity | Concepts Involved |
|---|---|---|
| Persistent chat history | Low | localStorage or SQLite |
| Document upload + RAG | High | Vector DB, embeddings, LangChain |
| User authentication | Medium | JWT tokens, FastAPI security |
| Deploy to cloud | Medium | Docker, Railway/Render |
| Streaming responses | Medium | FastAPI SSE, React streaming |

---

## Key Concepts to Review

1. **REST API design** — How does POST /api/v1/chat/query work end to end?
2. **Environment variables** — Why is the API key in `.env` and not hardcoded?
3. **API versioning** — Why did `gemini-1.5-flash` break and what does 404 mean here?
4. **Pydantic v2** — What is schema validation and why does a backend need it?
5. **CORS** — Why did we configure allowed origins in `config.py`?

