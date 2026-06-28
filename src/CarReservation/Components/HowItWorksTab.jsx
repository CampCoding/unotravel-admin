import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { carReservationAPI } from "../../api/endpoints.js";
import IconPicker from "../../Shared/IconPicker/IconPicker.jsx";

function toIconify(pascal) {
  if (!pascal) return null;
  return "lucide:" + pascal.replace(/([A-Z])/g, (m, l, i) => (i > 0 ? "-" : "") + l.toLowerCase());
}

const EMPTY = { step_number: "1", icon: "", title: "", description: "", sort_order: "0", is_active: true };

function StepModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title) { alert("Title is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, is_active: form.is_active ? 1 : 0 };
      if (initial?.id) await carReservationAPI.howItWorksUpdate(initial.id, payload);
      else              await carReservationAPI.howItWorksCreate(payload);
      onSaved(); onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-gray-800">{initial ? "Edit Step" : "Add Step"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Step number + title row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Step #</label>
              <input type="number" min="1" value={form.step_number} onChange={e => set("step_number", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Choose Vehicle"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
            </div>
          </div>

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

export default function HowItWorksTab() {
  const { data: raw, loading, error, refetch } = useFetch(carReservationAPI.howItWorksList);
  const [modal, setModal] = useState(null);
  const rows = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this step?")) return;
    await carReservationAPI.howItWorksDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load steps.</div>;

  return (
    <>
      {modal && <StepModal initial={modal === "new" ? null : modal} onClose={() => setModal(null)} onSaved={refetch} />}

      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setModal("new")} className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <Icon icon="mdi:plus" width={18} /> Add Step
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {rows.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">No steps yet.</div>
          )}
          {rows.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition ${r.is_active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blueMain text-white text-sm font-black flex items-center justify-center flex-shrink-0">
                    {r.step_number}
                  </span>
                  {r.icon && (
                    <Icon icon={toIconify(r.icon)} width={20} className="text-gray-500" title={r.icon} />
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setModal(r)} className="w-7 h-7 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                    <Icon icon="mdi:pencil-outline" width={14} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                    <Icon icon="mdi:trash-can-outline" width={14} />
                  </button>
                </div>
              </div>
              <p className="font-bold text-gray-800">{r.title}</p>
              {r.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
