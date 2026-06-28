import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { carReservationAPI } from "../../api/endpoints.js";
import IconPicker from "../../Shared/IconPicker/IconPicker.jsx";

// Display helper: PascalCase → lucide:kebab-case
function toIconify(pascal) {
  if (!pascal) return null;
  return "lucide:" + pascal.replace(/([A-Z])/g, (m, l, i) => (i > 0 ? "-" : "") + l.toLowerCase());
}

const EMPTY = { icon: "", title: "", description: "", accent_color: "#3b85c1", sort_order: "0", is_active: true };

function FeatureModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title) { alert("Title is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, is_active: form.is_active ? 1 : 0 };
      if (initial?.id) await carReservationAPI.featureUpdate(initial.id, payload);
      else              await carReservationAPI.featureCreate(payload);
      onSaved(); onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-gray-800">{initial ? "Edit Feature" : "Add Feature"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Icon
              {form.icon && (
                <span className="ml-2 inline-flex items-center gap-1 text-blueMain font-normal">
                  <Icon icon={toIconify(form.icon)} width={13} /> {form.icon}
                </span>
              )}
            </label>
            <IconPicker value={form.icon} onChange={v => set("icon", v)} />
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accent_color} onChange={e => set("accent_color", e.target.value)}
                className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer flex-shrink-0" />
              <input type="text" value={form.accent_color} onChange={e => set("accent_color", e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 font-mono" />
              <div className="flex gap-1">
                {["#3b85c1","#10b981","#8b5cf6","#f59e0b","#ef4444","#06b6d4"].map(c => (
                  <button key={c} type="button" onClick={() => set("accent_color", c)}
                    style={{ background: c }}
                    className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition" />
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Fully Insured"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 resize-none" />
          </div>

          {/* Sort + Active */}
          <div className="flex items-center gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set("sort_order", e.target.value)}
                className="w-24 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
            </div>
            <label className="flex items-center gap-2 mt-4 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={!!form.is_active} onChange={e => set("is_active", e.target.checked)} className="accent-blueMain w-4 h-4" />
              Active
            </label>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6 sticky bottom-0 bg-white pt-2 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesTab() {
  const { data: raw, loading, error, refetch } = useFetch(carReservationAPI.featuresList);
  const [modal, setModal] = useState(null);
  const rows = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    await carReservationAPI.featureDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load features.</div>;

  return (
    <>
      {modal && <FeatureModal initial={modal === "new" ? null : modal} onClose={() => setModal(null)} onSaved={refetch} />}

      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setModal("new")} className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <Icon icon="mdi:plus" width={18} /> Add Feature
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Icon</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Color</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-gray-400">No features yet.</td></tr>}
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {r.icon
                      ? <span className="inline-flex items-center gap-1.5 text-gray-700">
                          <Icon icon={toIconify(r.icon)} width={18} />
                          <span className="text-xs text-gray-400">{r.icon}</span>
                        </span>
                      : <span className="text-gray-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{r.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{r.description || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-gray-200" style={{ background: r.accent_color }} />
                      <span className="text-xs text-gray-400">{r.accent_color}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {r.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setModal(r)} className="w-8 h-8 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                        <Icon icon="mdi:pencil-outline" width={15} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                        <Icon icon="mdi:trash-can-outline" width={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
