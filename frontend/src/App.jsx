/**
 * App.jsx
 * ───────
 * Root component: orchestrates sidebar, navbar, and chat window.
 * Manages: session state, message history, loading/error state, dark-mode toggle.
 */

import { useState, useCallback } from "react";
import { DarkMode, LightMode } from "@mui/icons-material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { sendChatMessage } from "./services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

let messageCounter = 0;
function makeMessage(role, content) {
  return { id: ++messageCounter, role, content, timestamp: Date.now() };
}

let sessionCounter = 0;
function makeSession(firstMessage) {
  return {
    id: ++sessionCounter,
    title: firstMessage.length > 45 ? firstMessage.slice(0, 42) + "…" : firstMessage,
    createdAt: Date.now(),
    messages: [],
  };
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // Theme
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sessions
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Request state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Dark mode via class on <html> ─────────────────────────────────────────
  const toggleDark = () => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  // Init dark on mount
  useState(() => {
    document.documentElement.classList.toggle("dark", dark);
  });

  // ── Session management ────────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
  }, []);

  const handleSelectSession = useCallback(
    (id) => {
      const session = sessions.find((s) => s.id === id);
      if (session) {
        setActiveSessionId(id);
        setMessages(session.messages);
        setError(null);
      }
    },
    [sessions]
  );

  const handleDeleteSession = useCallback(
    (id) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([]);
      }
    },
    [activeSessionId]
  );

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = useCallback(
    async (text) => {
      setError(null);

      // Add user message optimistically
      const userMsg = makeMessage("user", text);
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);

      // Create a session if first message
      let currentSessionId = activeSessionId;
      if (!currentSessionId) {
        const newSession = makeSession(text);
        setSessions((prev) => [newSession, ...prev]);
        currentSessionId = newSession.id;
        setActiveSessionId(currentSessionId);
      }

      setIsLoading(true);

      // Build history for the API (all turns except the one we just added)
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      try {
        const data = await sendChatMessage(text, history);
        const assistantMsg = makeMessage("assistant", data.reply);

        const finalMessages = [...nextMessages, assistantMsg];
        setMessages(finalMessages);

        // Persist messages into the session record
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId ? { ...s, messages: finalMessages } : s
          )
        );
      } catch (err) {
        setError(err.message ?? "Failed to reach Study Buddy. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, activeSessionId]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        isConnected={!isLoading}
      />

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />

        {/* Chat area */}
        <main className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSend={handleSend}
          />
        </main>
      </div>

      {/* Dark mode FAB */}
      <button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className="fixed bottom-5 right-5 w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {dark ? <LightMode sx={{ fontSize: 16 }} /> : <DarkMode sx={{ fontSize: 16 }} />}
      </button>
    </div>
  );
}
