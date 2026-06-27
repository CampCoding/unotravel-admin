import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { intlToursAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

// Popular icons categorised for travel/services
const ICON_LIBRARY = [
  // Travel
  "mdi:airplane", "mdi:airplane-takeoff", "mdi:airplane-landing", "mdi:airplane-check",
  "mdi:airport", "mdi:seat-passenger", "mdi:passport", "mdi:ticket-confirmation-outline",
  "mdi:map-marker", "mdi:map-marker-path", "mdi:map-search-outline", "mdi:map",
  "mdi:earth", "mdi:earth-plus", "mdi:compass", "mdi:navigation",
  "mdi:bus", "mdi:train", "mdi:ship-wheel", "mdi:car-outline",
  "mdi:hotel", "mdi:bed-outline", "mdi:office-building-outline", "mdi:home-outline",
  "mdi:kaaba", "mdi:church", "mdi:mosque",
  // Services
  "mdi:headset", "mdi:phone-outline", "mdi:chat-outline", "mdi:email-outline",
  "mdi:shield-check-outline", "mdi:shield-star-outline", "mdi:lock-outline",
  "mdi:star-outline", "mdi:star-circle-outline", "mdi:crown-outline",
  "mdi:thumb-up-outline", "mdi:heart-outline", "mdi:hand-heart-outline",
  "mdi:account-group", "mdi:account-star-outline", "mdi:badge-account-outline",
  "mdi:currency-usd", "mdi:cash-multiple", "mdi:tag-outline", "mdi:sale",
  "mdi:clock-outline", "mdi:calendar-check-outline", "mdi:check-circle-outline",
  "mdi:flash-outline", "mdi:lightning-bolt", "mdi:rocket-outline",
  "mdi:gift-outline", "mdi:trophy-outline", "mdi:medal-outline",
  // Nature / Destinations
  "mdi:beach", "mdi:mountain", "mdi:forest", "mdi:city-variant-outline",
  "mdi:camera-outline", "mdi:image-outline", "mdi:panorama",
  "mdi:food-outline", "mdi:silverware-fork-knife",
  // Misc
  "mdi:information-outline", "mdi:help-circle-outline", "mdi:translate",
  "mdi:wifi", "mdi:car-key", "mdi:bag-suitcase-outline", "mdi:briefcase-outline",
];

function IconPicker({ value, color, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    search.trim()
      ? ICON_LIBRARY.filter(ic => ic.toLowerCase().includes(search.toLowerCase()))
      : ICON_LIBRARY,
    [search]
  );

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 hover:border-blueMain transition text-left"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color || "#264787"}22` }}>
          <Icon icon={value || "mdi:star-outline"} width={20} style={{ color: color || "#264787" }} />
        </div>
        <span className="flex-1 text-gray-700 truncate">{value || "Choose icon…"}</span>
        <Icon icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} width={16} className="text-gray-400 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search icons…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blueMain/30"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-8 gap-1 p-3 max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="col-span-8 text-center text-xs text-gray-400 py-4">No icons found</p>
            )}
            {filtered.map(ic => (
              <button
                key={ic}
                type="button"
                title={ic}
                onClick={() => { onChange(ic); setOpen(false); setSearch(""); }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-blue-50 ${value === ic ? "bg-blueMain/10 ring-2 ring-blueMain" : ""}`}
              >
                <Icon icon={ic} width={20} style={{ color: value === ic ? color : "#4B5563" }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureForm({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    icon:       item?.icon       ?? "mdi:airplane",
    color:      item?.color      ?? "#3B85C1",
    sort_order: item?.sort_order ?? 0,
    is_active:  item?.is_active  ?? 1,
  });
  const [trans, setTrans] = useState({
    en: { language_id: 1, title: item?.translations?.find(t => t.language_id === 1)?.title ?? "", description: item?.translations?.find(t => t.language_id === 1)?.description ?? "" },
    ar: { language_id: 2, title: item?.translations?.find(t => t.language_id === 2)?.title ?? "", description: item?.translations?.find(t => t.language_id === 2)?.description ?? "" },
  });
  const [activeLang, setActiveLang] = useState("en");
  const isAr = activeLang === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        translations: JSON.stringify([
          { ...trans.en, language_id: 1 },
          { ...trans.ar, language_id: 2 },
        ]),
      };
      if (isEdit) await intlToursAPI.featureUpdate(item.id, payload);
      else        await intlToursAPI.featureCreate(payload);
      onSaved();
      onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">{isEdit ? "Edit Feature" : "New Feature"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Icon picker + Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon</label>
              <IconPicker
                value={form.icon}
                color={form.color}
                onChange={ic => setForm(p => ({ ...p, icon: ic }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  className="h-10 w-12 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0" />
                <input type="text" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  className={inp} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Active</label>
              <select value={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.value }))} className={inp}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Lang tabs */}
          <div>
            <div className="flex gap-2 mb-4">
              {["en","ar"].map(lang => (
                <button key={lang} type="button" onClick={() => setActiveLang(lang)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeLang===lang?"bg-blueMain text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {lang==="en"?"🇬🇧 English":"🇸🇦 Arabic"}
                </button>
              ))}
            </div>
            <div dir={isAr?"rtl":"ltr"} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isAr?"العنوان":"Title"}</label>
                <input type="text" value={trans[activeLang].title}
                  onChange={e => setTrans(p => ({ ...p, [activeLang]: { ...p[activeLang], title: e.target.value } }))}
                  className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isAr?"الوصف":"Description"}</label>
                <textarea rows={3} value={trans[activeLang].description}
                  onChange={e => setTrans(p => ({ ...p, [activeLang]: { ...p[activeLang], description: e.target.value } }))}
                  className={inp + " resize-none"} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FeaturesTab() {
  const { data: raw, loading, error, refetch } = useFetch(intlToursAPI.featuresList);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const features = Array.isArray(raw) ? raw : [];

  const getTitle = (f) => f?.translations?.find(t => t.language_id === 1)?.title || f?.translations?.[0]?.title || `Feature #${f.id}`;
  const getDesc  = (f) => f?.translations?.find(t => t.language_id === 1)?.description || "";

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    await intlToursAPI.featureDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load features.</div>;

  return (
    <>
      {(showForm || editItem) && (
        <FeatureForm
          item={editItem}
          onClose={() => { setEditItem(null); setShowForm(false); }}
          onSaved={refetch}
        />
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Icon icon="mdi:plus" width={16} /> Add Feature
        </button>
      </div>

      {features.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          No features yet. Add one above.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 ${!f.is_active ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${f.color}18` }}>
                <Icon icon={f.icon || "mdi:star"} width={24} style={{ color: f.color }} />
              </div>
              <div className="flex gap-1.5 ml-auto">
                <button onClick={() => setEditItem(f)}
                  className="w-8 h-8 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                  <Icon icon="mdi:pencil" width={14} />
                </button>
                <button onClick={() => handleDelete(f.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                  <Icon icon="mdi:trash-can-outline" width={14} />
                </button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{getTitle(f)}</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{getDesc(f)}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Sort: {f.sort_order}</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold ${f.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                {f.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
