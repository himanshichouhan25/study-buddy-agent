# Study Buddy Agent

A modular, production-grade AI study companion. FastAPI + Gemini backend, React (Vite) + Tailwind + Shadcn UI frontend.

## 1. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and paste your GEMINI_API_KEY (https://aistudio.google.com/app/apikey)

uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

## 2. Frontend Setup

```bash
cd frontend
npm install
```

### Installing Shadcn UI (one-time)

The boilerplate already ships with `components.json`, `jsconfig.json`, the CSS variable theme in `index.css`, and `src/lib/utils.js` (the `cn()` helper) — everything Shadcn's CLI expects to find. To pull in the CLI and add components:

```bash
# 1. Initialize (will detect the existing components.json — just confirm the prompts)
npx shadcn@latest init

# 2. Add the components you need, e.g.:
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add scroll-area
npx shadcn@latest add avatar
npx shadcn@latest add dialog
```

Each `add` command drops a ready-to-edit component into `src/components/ui/`. Import them like:

```jsx
import { Button } from "@/components/ui/button";
```

> Note: the chat UI shipped in this boilerplate (`ChatWindow.jsx`, `Sidebar.jsx`, `Navbar.jsx`) is built with plain Tailwind + MUI icons so it works immediately without running the CLI. Swap in Shadcn primitives (`Button`, `Input`, `ScrollArea`) at your own pace once they're installed — the CSS variable theme is already wired up to match.

### Run the dev server

```bash
npm run dev
```

Frontend runs at `http://localhost:5173` and talks to the backend at `http://localhost:8000/api/v1` (see `src/services/api.js`; override with a `VITE_API_BASE_URL` env var if needed).

## 3. Project Structure

```
study-buddy-agent/
├── backend/
│   └── app/
│       ├── api/v1/        # routers
│       ├── core/          # Gemini agent logic
│       ├── schemas/       # Pydantic v2 models
│       ├── config.py      # pydantic-settings
│       └── main.py        # FastAPI app + CORS
└── frontend/
    └── src/
        ├── components/    # ChatWindow, Sidebar, Navbar
        ├── services/      # api.js (Axios)
        └── App.jsx
```

## 4. Architecture Notes

- **Modularity:** routers, schemas, and core logic are fully decoupled. Adding a new resource means creating a new router in `api/v1/` and registering it in `api/v1/router.py` — `main.py` never changes.
- **Config:** all secrets/origins load via `pydantic-settings` from `.env`; nothing is hardcoded.
- **Agent:** `core/agent.py` wraps the Gemini `google-generativeai` SDK behind a singleton (`get_agent()`), keeping the system prompt, generation config, and history-conversion logic in one place.
- **Frontend state:** session/message state lives in `App.jsx` and is passed down as props — no global store needed at this scale, but the prop boundaries make it easy to swap in Zustand/Redux later if it grows.
