import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { visaAPI } from "../../api/endpoints.js";

const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const EMPTY = { slug: "", name: "", description: "", is_active: 1, sort_order: 0 };

function VisaTypeForm({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (isEdit) await visaAPI.visaTypeUpdate(item.id, form);
      else        await visaAPI.visaTypeCreate(form);
      onSaved(); onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{isEdit ? "Edit Visa Type" : "Add Visa Type"}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Slug * (e.g. tourist)</label>
            <input value={form.slug} onChange={e => set("slug", e.target.value.toLowerCase().replace(/\s+/g,"-"))} required className={inp} placeholder="tourist" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} required className={inp} placeholder="Tourist Visa" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)} className={inp + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set("sort_order", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Active</label>
              <select value={form.is_active} onChange={e => set("is_active", e.target.value)} className={inp}>
                <option value={1}>Active</option><option value={0}>Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VisaTypesTab() {
  const { data: raw, loading, refetch } = useFetch(visaAPI.visaTypesList);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const items = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visa type?")) return;
    await visaAPI.visaTypeDelete(id); refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;

  return (
    <>
      {(showForm || edit) && (
        <VisaTypeForm item={edit} onClose={() => { setEdit(null); setShowForm(false); }} onSaved={refetch} />
      )}
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blueMain text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          <Icon icon="mdi:plus" width={15} /> Add Visa Type
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2 ${!item.is_active ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs font-mono text-gray-400">{item.slug}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEdit(item)} className="w-7 h-7 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center">
                  <Icon icon="mdi:pencil" width={13} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center">
                  <Icon icon="mdi:trash-can-outline" width={13} />
                </button>
              </div>
            </div>
            {item.description && <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>}
            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-1">
              <span>Sort: {item.sort_order}</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold ${item.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                {item.is_active ? "Active" : "Off"}
              </span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">No visa types yet.</div>
        )}
      </div>
    </>
  );
}
