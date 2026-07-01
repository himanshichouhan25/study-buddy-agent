/**
 * components/ChatWindow.jsx
 * ─────────────────────────
 * Auto-scrolling message list with markdown rendering + input bar.
 * Handles: empty state, loading skeleton, error display, and the send form.
 */

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AutoStories,
  Person,
  Send,
  SmartToy,
  StopCircleOutlined,
} from "@mui/icons-material";

// ── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        }`}
      >
        {isUser ? (
          <Person sx={{ fontSize: 16 }} />
        ) : (
          <SmartToy sx={{ fontSize: 16 }} />
        )}
      </div>

      {/* Content */}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="!rounded-lg !text-xs !my-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] font-mono text-indigo-700 dark:text-indigo-300"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                hr() {
                  return <hr className="border-slate-200 dark:border-slate-700 my-3" />;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {/* Timestamp */}
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// ── Loading dots ──────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
        <SmartToy sx={{ fontSize: 16 }} />
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  const starters = [
    "Explain Big O notation with examples",
    "What is the difference between a stack and a queue?",
    "How does TCP/IP work?",
    "Walk me through how a hash table works",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
        <AutoStories sx={{ fontSize: 32, color: "#6366f1" }} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          What are we studying today?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Ask me anything about Computer Science — I'll explain it clearly and keep you thinking.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
        {starters.map((s) => (
          <StarterChip key={s} text={s} />
        ))}
      </div>
    </div>
  );
}

function StarterChip({ text, onClick }) {
  return (
    <button
      onClick={() => onClick?.(text)}
      className="text-left text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
    >
      {text}
    </button>
  );
}

// ── Main ChatWindow ───────────────────────────────────────────────────────────

export default function ChatWindow({ messages, isLoading, error, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleStarterClick(text) {
    onSend(text);
  }

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          <EmptyState onStarterClick={handleStarterClick} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-2 items-end"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask Study Buddy anything… (Shift+Enter for new line)"
              rows={1}
              className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed max-h-40 overflow-y-auto"
              style={{ minHeight: "46px", height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-[46px] w-[46px] shrink-0 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 dark:disabled:text-slate-500 transition-colors shadow-sm disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <Send sx={{ fontSize: 18 }} />
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
          Study Buddy can make mistakes — always verify critical facts.
        </p>
      </div>
    </div>
  );
}
