import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { visaAPI } from "../../api/endpoints.js";

const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

const EMPTY = { code: "", name: "", flag: "", is_active: 1, sort_order: 0 };

function CountryForm({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await visaAPI.countryUpdate(item.id, form);
      else        await visaAPI.countryCreate(form);
      onSaved(); onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{isEdit ? "Edit Country" : "Add Country"}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ISO Code *</label>
              <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} maxLength={3} required className={inp} placeholder="EG" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Country Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} required className={inp} placeholder="Egypt" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Flag Emoji</label>
              <input value={form.flag} onChange={e => set("flag", e.target.value)} className={inp} placeholder="🇪🇬" />
            </div>
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

export default function CountriesTab() {
  const { data: raw, loading, refetch } = useFetch(visaAPI.countriesList);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const countries = Array.isArray(raw) ? raw : [];
  const filtered  = search ? countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())) : countries;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this country?")) return;
    await visaAPI.countryDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;

  return (
    <>
      {(showForm || edit) && (
        <CountryForm item={edit} onClose={() => { setEdit(null); setShowForm(false); }} onSaved={refetch} />
      )}

      <div className="flex items-center justify-between gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search countries…"
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 w-64 outline-none focus:ring-2 focus:ring-blueMain/30" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{filtered.length} countries</span>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blueMain text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            <Icon icon="mdi:plus" width={15} /> Add Country
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Flag</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Sort</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition">
                <td className="px-4 py-2.5 text-2xl">{c.flag}</td>
                <td className="px-4 py-2.5 font-mono text-xs font-bold text-gray-500">{c.code}</td>
                <td className="px-4 py-2.5 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-2.5 text-center text-gray-400 text-xs">{c.sort_order}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {c.is_active ? "Active" : "Off"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setEdit(c)} className="w-7 h-7 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                      <Icon icon="mdi:pencil" width={13} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                      <Icon icon="mdi:trash-can-outline" width={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No countries found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
