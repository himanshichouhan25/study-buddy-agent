<div align="center">

# 📚 Study Buddy Agent

### An AI-powered CS study companion that explains concepts clearly, provides real examples, and keeps you thinking.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

 • [Report Bug](https://github.com/himanshichouhan25/study-buddy-agent/issues) • [LinkedIn](https://www.linkedin.com/in/himanshi-chouhan-69180a339/)

</div>

---

## 🧩 Problem Statement

Students studying Computer Science independently often struggle to get **clear, interactive, and instant explanations** with real-world examples on demand. Textbooks are static, search results are scattered, and tutors aren't always available.

**Study Buddy Agent** solves this by acting as an always-available AI peer tutor — powered by Google Gemini — that explains CS concepts simply, provides code examples, and keeps learners engaged through follow-up questions.

---

## ✨ Features

- 🤖 **AI-Powered CS Tutor** — Explains algorithms, data structures, networking, system design, and more
- 💡 **Example-Driven Answers** — Every response includes real-world examples or code snippets
- 🧠 **Engagement Hook** — Ends every response with 1 conceptual question to deepen understanding
- 💬 **Multi-turn Conversations** — Maintains conversation history within a session
- 🗂️ **Session Management** — Sidebar shows past chats; switch between conversations instantly
- 🌙 **Dark / Light Mode** — Toggle between themes with one click
- ⚡ **Loading States** — Spinner + disabled input while waiting for AI response
- 📋 **Markdown + Code Highlighting** — Responses render beautifully with syntax-highlighted code blocks

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | User Interface |
| **Styling** | Tailwind CSS + Shadcn UI | Design System |
| **Icons** | Material UI Icons | UI Icons |
| **Backend** | Python FastAPI | REST API Server |
| **Server** | Uvicorn | ASGI Server |
| **AI Model** | Google Gemini 2.0 Flash | Response Generation |
| **Validation** | Pydantic v2 | Request/Response Schemas |
| **Config** | pydantic-settings + .env | Secret Management |
| **HTTP Client** | Axios | Frontend → Backend Requests |
| **Markdown** | react-markdown + remark-gfm | Render AI Responses |

---

## 🏗️ Architecture & Workflow

```
User types a CS question
         │
         ▼
React Frontend (localhost:5173)
  • Sends message + chat history
         │
         ▼  HTTP POST /api/v1/chat/query
FastAPI Backend (localhost:8000)
  • Pydantic validates request schema
  • CORS middleware checks origin
         │
         ▼
StudyBuddyAgent (core/agent.py)
  • Applies system prompt (CS peer tutor persona)
  • Converts history to Gemini format
  • Sends to Gemini API
         │
         ▼
Google Gemini 2.0 Flash
  • Generates markdown response
  • Adds 1 conceptual question at the end
         │
         ▼
FastAPI returns JSON response
         │
         ▼
React renders markdown + code blocks
User sees reply with syntax highlighting
```

---

## 📁 Project Structure

```
study-buddy-agent/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point + CORS setup
│   │   ├── config.py            # pydantic-settings: loads .env secrets
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py    # Aggregates all sub-routers
│   │   │       └── chat.py      # POST /api/v1/chat/query endpoint
│   │   ├── core/
│   │   │   └── agent.py         # Gemini API logic + system prompt
│   │   └── schemas/
│   │       └── chat.py          # Pydantic v2 request/response models
│   ├── .env                     # Your secrets (never commit this)
│   ├── .env.example             # Template for contributors
│   └── requirements.txt         # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx              # Root layout + session/message state
    │   ├── components/
    │   │   ├── ChatWindow.jsx   # Message list + input bar + markdown
    │   │   ├── Sidebar.jsx      # Session list + New Chat button
    │   │   └── Navbar.jsx       # App title + Gemini status indicator
    │   ├── services/
    │   │   └── api.js           # Axios instance → backend API calls
    │   └── index.css            # Tailwind directives + CSS variables
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.11+ (recommended; 3.14 may cause dependency issues)
- Node.js 18+ and npm
- Google Gemini API Key → [Get one free here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/himanshichouhan25/study-buddy-agent.git
cd study-buddy-agent
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows CMD)
.venv\Scripts\activate

# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### 3. Configure Environment Variables

Open `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
APP_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## 🚀 How to Run

Open **two terminals** simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend
.venv\Scripts\activate      # Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

Backend API docs available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns server status |
| `POST` | `/api/v1/chat/query` | Send a message and get AI response |

### Example Request

```json
POST /api/v1/chat/query
{
  "message": "Explain recursion with an example",
  "history": [
    { "role": "user", "content": "What is a function?" },
    { "role": "assistant", "content": "A function is a reusable block of code..." }
  ]
}
```

### Example Response

```json
{
  "reply": "## Recursion\n\nRecursion is when a function calls itself...",
  "model": "gemini-2.0-flash",
  "tokens_used": 312
}
```

---

## 💬 Example Usage

**User:** `Explain Big O notation with examples`

**Study Buddy:** 
> Big O notation describes how the runtime of an algorithm grows relative to its input size...
> 
> ```python
> # O(n) - Linear time
> def find_max(arr):
>     max_val = arr[0]
>     for num in arr:        # runs n times
>         if num > max_val:
>             max_val = num
>     return max_val
> ```
> 
> 💡 **Think about this:** If you doubled the size of your input array, how would that affect an O(n²) algorithm compared to an O(n log n) one?

---

## 🗺️ Roadmap

- [ ] **Persistent Chat History** — Save conversations using SQLite/PostgreSQL
- [ ] **Document Upload + RAG** — Upload PDFs and ask questions about them
- [ ] **User Authentication** — JWT-based login system
- [ ] **Streaming Responses** — Real-time token-by-token response rendering
- [ ] **Quiz Generation** — Auto-generate MCQs from any CS topic
- [ ] **Cloud Deployment** — Deploy on Railway / Render / Vercel

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add: your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing modular structure and does not expose any API keys.

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute this project for personal and commercial purposes, provided the original copyright notice is included.

See the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Himanshi Chouhan**

[![GitHub](https://img.shields.io/badge/GitHub-himanshichouhan25-181717?style=flat&logo=github)](https://github.com/himanshichouhan25)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Himanshi_Chouhan-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/himanshi-chouhan-69180a339/)

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev) — for the AI backbone
- [FastAPI](https://fastapi.tiangolo.com) — for the elegant Python web framework
- [Shadcn UI](https://ui.shadcn.com) — for the beautiful component system
- [react-markdown](https://github.com/remarkjs/react-markdown) — for rendering AI responses

---

<div align="center">
  <p>Built with ❤️ during the Agentic AI Internship</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
