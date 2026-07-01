/**
 * components/Navbar.jsx
 * ─────────────────────
 * Top navigation bar: app title, live status indicator, and sidebar toggle.
 */

import { AutoStories, Menu, MenuOpen } from "@mui/icons-material";

export default function Navbar({ sidebarOpen, onToggleSidebar, isConnected }) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 z-10">
      {/* Left — sidebar toggle + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? <MenuOpen fontSize="small" /> : <Menu fontSize="small" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <AutoStories sx={{ fontSize: 16, color: "white" }} />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
            Study Buddy
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 font-mono">
            / AI Tutor
          </span>
        </div>
      </div>

      {/* Right — connection status */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
          }`}
        />
        <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
          {isConnected ? "Gemini connected" : "Waiting for response"}
        </span>
      </div>
    </header>
  );
}
