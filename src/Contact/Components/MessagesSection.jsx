import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { contactMessagesAPI } from "../../api/endpoints.js";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

function MessageRow({ msg, onDelete, onRead }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        msg.is_read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.is_read ? "bg-gray-100" : "bg-blue-100"}`}>
            <Icon icon="mdi:email" className={msg.is_read ? "text-gray-400" : "text-blue-600"} width={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-gray-800">{msg.name}</span>
              {!msg.is_read && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">New</span>
              )}
              <span className="text-xs text-gray-400">{fmtDate(msg.created_at)}</span>
            </div>
            {msg.email && (
              <p className="text-xs text-gray-500 mt-0.5">{msg.email}</p>
            )}
            {msg.subject && (
              <p className="text-sm font-semibold text-gray-700 mt-1">{msg.subject}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!msg.is_read && (
            <button
              onClick={() => onRead(msg.id)}
              title="Mark as read"
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition"
            >
              <Icon icon="mdi:email-open" width={16} />
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <Icon icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} width={16} />
          </button>
          <button
            onClick={() => onDelete(msg.id)}
            className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition"
          >
            <Icon icon="mdi:trash-can-outline" width={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pl-12 pr-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-3">
            {msg.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MessagesSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = useCallback((p = 1, unread = unreadOnly) => {
    setLoading(true);
    contactMessagesAPI
      .list({ page: p, limit: 20, unread: unread ? "1" : undefined })
      .then((res) => {
        setMessages(res.data?.data ?? []);
        setMeta(res.data?.meta ?? null);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [unreadOnly]);

  useEffect(() => { load(1, unreadOnly); }, [unreadOnly]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    await contactMessagesAPI.delete(id).catch(() => {});
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRead = async (id) => {
    await contactMessagesAPI.markRead(id).catch(() => {});
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)));
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">Inbox</h2>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => { setUnreadOnly(e.target.checked); setPage(1); }}
              className="accent-blue-600"
            />
            Unread only
          </label>
          <button
            onClick={() => load(page, unreadOnly)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            <Icon icon="mdi:refresh" width={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 gap-2">
          <Icon icon="mdi:loading" className="animate-spin" width={22} />
          Loading messages…
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
          <Icon icon="mdi:email-outline" width={44} className="opacity-20" />
          <p className="text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageRow key={msg.id} msg={msg} onDelete={handleDelete} onRead={handleRead} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => { setPage(p); load(p, unreadOnly); }}
              className={`w-9 h-9 rounded-full text-sm font-bold transition ${
                page === p ? "bg-blueMain text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-blueMain"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
