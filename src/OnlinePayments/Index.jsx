import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Header from "../Shared/Header/Header.jsx";
import api from "../api/config.js";

const multipart = { headers: { "Content-Type": undefined } };

const STATUS_COLORS = {
  pending:    "bg-yellow-50 text-yellow-600",
  processing: "bg-blue-50 text-blue-600",
  completed:  "bg-green-50 text-green-600",
  cancelled:  "bg-red-50 text-red-600",
};
const STATUS_LIST = ["pending", "processing", "completed", "cancelled"];

function FileIcon({ name }) {
  const ext = name?.split(".").pop()?.toLowerCase();
  const icons = { pdf: "mdi:file-pdf-box", doc: "mdi:file-word-box", docx: "mdi:file-word-box", xls: "mdi:file-excel-box", xlsx: "mdi:file-excel-box", zip: "mdi:zip-box" };
  const icon = icons[ext] || (["jpg","jpeg","png","gif","webp"].includes(ext) ? "mdi:image" : "mdi:file-outline");
  return <Icon icon={icon} width={16} className="shrink-0 text-gray-400" />;
}

function DetailModal({ item, onClose, onUpdated }) {
  const [status, setStatus]   = useState(item.status);
  const [amount, setAmount]   = useState(item.amount ?? "");
  const [notes, setNotes]     = useState(item.admin_notes ?? "");
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving]   = useState(false);
  const fileRef = useRef();

  const attachments = item.attachments || [];
  const userAtts    = attachments.filter(a => a.uploaded_by === "user");
  const adminAtts   = attachments.filter(a => a.uploaded_by === "admin");

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setNewFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size));
      return [...prev, ...selected.filter(f => !existing.has(f.name + f.size))];
    });
    e.target.value = "";
  };

  const removeNew = (i) => setNewFiles(prev => prev.filter((_, idx) => idx !== i));

  const deleteAtt = async (attId) => {
    if (!window.confirm("Delete this attachment?")) return;
    await api.delete(`/admin/online-payments/${item.id}/attachments/${attId}`);
    onUpdated();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("status", status);
      if (amount !== "")  fd.append("amount", amount);
      if (notes !== "")   fd.append("admin_notes", notes);
      newFiles.forEach(f => fd.append("attachments", f));
      await api.put(`/admin/online-payments/${item.id}`, fd, multipart);
      onUpdated();
      onClose();
    } catch { alert("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Payment Request #{item.id}</h3>
            <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Customer Info */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Customer Info</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400 text-xs">Name</span><br /><span className="font-medium">{item.name}</span></div>
              <div><span className="text-gray-400 text-xs">Phone</span><br /><span className="font-medium">{item.phone}</span></div>
              <div className="col-span-2"><span className="text-gray-400 text-xs">Email</span><br /><span className="font-medium">{item.email}</span></div>
              {item.notes && <div className="col-span-2"><span className="text-gray-400 text-xs">Notes</span><br /><span className="text-gray-600 text-sm">{item.notes}</span></div>}
              {item.link  && <div className="col-span-2"><span className="text-gray-400 text-xs">Link</span><br /><a href={item.link} target="_blank" rel="noreferrer" className="text-blueMain hover:underline text-sm break-all">{item.link}</a></div>}
            </div>
          </section>

          {/* User Attachments */}
          {userAtts.length > 0 && (
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Customer Attachments</p>
              <div className="space-y-1">
                {userAtts.map(a => (
                  <div key={a.id} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileIcon name={a.original_name} />
                      <a href={a.file_url} target="_blank" rel="noreferrer" className="text-xs text-blueMain hover:underline truncate">{a.original_name || "File"}</a>
                    </div>
                    <button onClick={() => deleteAtt(a.id)} className="ml-2 text-gray-300 hover:text-red-500 shrink-0 transition"><Icon icon="mdi:trash-can-outline" width={14} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admin Attachments */}
          {adminAtts.length > 0 && (
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Admin Attachments</p>
              <div className="space-y-1">
                {adminAtts.map(a => (
                  <div key={a.id} className="flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileIcon name={a.original_name} />
                      <a href={a.file_url} target="_blank" rel="noreferrer" className="text-xs text-blueMain hover:underline truncate">{a.original_name || "File"}</a>
                    </div>
                    <button onClick={() => deleteAtt(a.id)} className="ml-2 text-gray-300 hover:text-red-500 shrink-0 transition"><Icon icon="mdi:trash-can-outline" width={14} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upload Admin Files */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Upload Files (Receipt / Docs)</p>
            <div onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-blueMain hover:text-blueMain transition cursor-pointer">
              <Icon icon="mdi:upload" width={16} />
              Click to attach files (any type)
            </div>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
            {newFiles.length > 0 && (
              <ul className="mt-2 space-y-1">
                {newFiles.map((f, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                    <span className="truncate text-gray-700 font-medium">{f.name}</span>
                    <button type="button" onClick={() => removeNew(i)} className="ml-2 text-gray-400 hover:text-red-500">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Amount */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Amount</p>
            <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blueMain/30" />
          </section>

          {/* Status */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_LIST.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition capitalize ${
                    status === s ? "border-blueMain bg-blueMain text-white" : "border-gray-200 text-gray-500 hover:border-blueMain/50"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Admin Notes */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Admin Notes</p>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blueMain/30 resize-none" />
          </section>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Close</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnlinePayments() {
  const [requests, setRequests]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filterStatus, setFilterStatus]   = useState("");
  const [viewItem, setViewItem]           = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await api.get("/admin/online-payments", { params });
      setRequests(res.data?.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await api.delete(`/admin/online-payments/${id}`);
    load();
  };

  const openItem = (r) => setViewItem(r);

  return (
    <>
      {viewItem && <DetailModal item={viewItem} onClose={() => setViewItem(null)} onUpdated={() => { load(); setViewItem(null); }} />}
      <Header title="Online Payments" icon="mdi:credit-card-outline" />

      <div className="p-6">
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {["", ...STATUS_LIST].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${
                filterStatus === s ? "bg-blueMain text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {s || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Files</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{r.id}</td>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{r.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{r.email}</td>
                    <td className="px-4 py-2.5 text-gray-600">{r.phone}</td>
                    <td className="px-4 py-2.5 text-gray-600">{r.amount ? `$${r.amount}` : "—"}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">
                      {(r.attachments || []).length > 0
                        ? <span className="px-2 py-0.5 bg-gray-100 rounded-full font-semibold">{r.attachments.length} file{r.attachments.length > 1 ? "s" : ""}</span>
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-500"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openItem(r)} className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition" title="View details">
                          <Icon icon="mdi:eye-outline" width={13} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                          <Icon icon="mdi:trash-can-outline" width={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No payment requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
