/**
 * components/Sidebar.jsx
 * ──────────────────────
 * Collapsible sidebar: new chat button, past chats list, and document upload placeholder.
 */

import { Add, ChatBubbleOutline, CloudUploadOutlined, DeleteOutline } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

export default function Sidebar({ open, sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession }) {
  if (!open) return null;

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
        >
          <Add fontSize="small" />
          New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8 px-4">
            No past chats yet. Start a conversation!
          </p>
        ) : (
          <ul className="space-y-0.5">
            <li className="px-2 pt-1 pb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Recent
              </span>
            </li>
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={`group w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    session.id === activeSessionId
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                      : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <ChatBubbleOutline
                    sx={{ fontSize: 14, marginTop: "2px", flexShrink: 0 }}
                    className="opacity-60"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-snug">
                      {session.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {/* Delete button (shows on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    aria-label="Delete chat"
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity shrink-0"
                  >
                    <DeleteOutline sx={{ fontSize: 14 }} />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload placeholder */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        <button
          disabled
          title="Coming soon"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 transition-colors cursor-not-allowed"
        >
          <CloudUploadOutlined sx={{ fontSize: 16 }} />
          Upload Study Document
          <span className="ml-auto text-[9px] bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-500">
            Soon
          </span>
        </button>
      </div>
    </aside>
  );
}
