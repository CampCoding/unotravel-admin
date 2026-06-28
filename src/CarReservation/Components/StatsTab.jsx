import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { carReservationAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

const EMPTY = { value: "", label: "", sort_order: "0", is_active: 1 };

function StatModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.value || !form.label) { alert("Value and label are required"); return; }
    setSaving(true);
    try {
      if (isEdit) await carReservationAPI.statUpdate(initial.id, form);
      else        await carReservationAPI.statCreate(form);
      onSaved(); onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">{isEdit ? "Edit Stat" : "Add Stat"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Value *</label>
            <input value={form.value} onChange={e => set("value", e.target.value)}
              placeholder="500+" className={inp} />
            <p className="text-xs text-gray-400 mt-1">e.g. 500+, 24/7, 100%, 4.9★</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Label *</label>
            <input value={form.label} onChange={e => set("label", e.target.value)}
              placeholder="Vehicles" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set("sort_order", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Active</label>
              <select value={form.is_active} onChange={e => set("is_active", e.target.value)} className={inp}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
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

export default function StatsTab() {
  const { data: raw, loading, error, refetch } = useFetch(carReservationAPI.statsList);
  const [modal, setModal] = useState(null);
  const stats = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stat?")) return;
    await carReservationAPI.statDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load stats.</div>;

  return (
    <>
      {modal && (
        <StatModal
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={refetch}
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            These numbers appear in the stats bar at the bottom of the hero section.
          </p>
          <button onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <Icon icon="mdi:plus" width={16} /> Add Stat
          </button>
        </div>

        {/* Preview bar */}
        {stats.filter(s => s.is_active).length > 0 && (
          <div className="bg-gray-900 rounded-xl px-6 py-4 grid grid-cols-4 divide-x divide-white/15">
            {stats.filter(s => s.is_active).map(s => (
              <div key={s.id} className="text-center px-4">
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-[11px] text-white/55 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Label</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400">No stats yet.</td></tr>
              )}
              {stats.map(s => (
                <tr key={s.id} className={`hover:bg-gray-50/50 transition-colors ${!s.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 font-black text-gray-800 text-lg">{s.value}</td>
                  <td className="px-4 py-3 text-gray-600 uppercase text-xs tracking-wider">{s.label}</td>
                  <td className="px-4 py-3 text-gray-500">{s.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.is_active ? "Active" : "Off"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setModal(s)}
                        className="w-8 h-8 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                        <Icon icon="mdi:pencil-outline" width={15} />
                      </button>
                      <button onClick={() => handleDelete(s.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
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
