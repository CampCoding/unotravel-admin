import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { umrahAPI } from "../../api/endpoints.js";
import RichText from "../../Shared/Form/RichText.jsx";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

const EMPTY_TRANS = (langId) => ({ language_id: langId, title: "", description: "", costs_list: [] });

const parseCosts = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
};

export default function PackageForm({ pkg, onClose, onSaved }) {
  const isEdit = !!pkg;
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(pkg?.image_url || null);

  // Parse existing travel_dates "DD/MM/YYYY - DD/MM/YYYY" into ISO date strings
  const parseTravelDates = (str) => {
    if (!str) return { from: "", to: "" };
    const parts = str.split(/\s*[-–]\s*/);
    const toISO = (s) => {
      s = s.trim().replace(/[^\d/]/g, "");
      const m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
      if (!m) return "";
      const y = m[3] || new Date().getFullYear();
      return `${y}-${String(m[2]).padStart(2,"0")}-${String(m[1]).padStart(2,"0")}`;
    };
    return parts.length >= 2 ? { from: toISO(parts[0]), to: toISO(parts[1]) } : { from: "", to: "" };
  };
  const parsedDates = parseTravelDates(pkg?.travel_dates);

  const [form, setForm] = useState({
    price:             pkg?.price      ?? "",
    duration:          pkg?.duration   ?? "",
    travel_dates:      pkg?.travel_dates ?? "",
    travel_date_from:  parsedDates.from,
    travel_date_to:    parsedDates.to,
    is_active:         pkg?.is_active  ?? 1,
    sort_order:        pkg?.sort_order ?? 0,
  });

  const [trans, setTrans] = useState({
    en: {
      language_id: 1,
      title:       pkg?.translations?.find(t => t.language_id === 1)?.title       ?? "",
      description: pkg?.translations?.find(t => t.language_id === 1)?.description ?? "",
      costs_list:  parseCosts(pkg?.translations?.find(t => t.language_id === 1)?.costs_list),
    },
    ar: {
      language_id: 2,
      title:       pkg?.translations?.find(t => t.language_id === 2)?.title       ?? "",
      description: pkg?.translations?.find(t => t.language_id === 2)?.description ?? "",
      costs_list:  parseCosts(pkg?.translations?.find(t => t.language_id === 2)?.costs_list),
    },
  });

  const [activeLang, setActiveLang] = useState("en");

  const setT = (lang, field, val) =>
    setTrans(prev => ({ ...prev, [lang]: { ...prev[lang], [field]: val } }));

  // ── Costs list helpers ───────────────────────────────────────
  const addCost = (lang) =>
    setTrans(prev => ({ ...prev, [lang]: { ...prev[lang], costs_list: [...prev[lang].costs_list, ""] } }));

  const updateCost = (lang, idx, val) =>
    setTrans(prev => {
      const list = [...prev[lang].costs_list];
      list[idx] = val;
      return { ...prev, [lang]: { ...prev[lang], costs_list: list } };
    });

  const removeCost = (lang, idx) =>
    setTrans(prev => {
      const list = prev[lang].costs_list.filter((_, i) => i !== idx);
      return { ...prev, [lang]: { ...prev[lang], costs_list: list } };
    });

  const moveCost = (lang, idx, dir) =>
    setTrans(prev => {
      const list = [...prev[lang].costs_list];
      const target = idx + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[idx], list[target]] = [list[target], list[idx]];
      return { ...prev, [lang]: { ...prev[lang], costs_list: list } };
    });

  // ── File ──────────────────────────────────────────────────────
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trans.en.title.trim()) return alert("English title is required");
    setSaving(true);
    try {
      const translations = [
        { ...trans.en, language_id: 1, costs_list: JSON.stringify(trans.en.costs_list.filter(c => c.trim())) },
        { ...trans.ar, language_id: 2, costs_list: JSON.stringify(trans.ar.costs_list.filter(c => c.trim())) },
      ];

      // Format travel_dates from the two date pickers
      const fmtDate = (iso) => {
        if (!iso) return "";
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
      };
      const combinedDates = form.travel_date_from && form.travel_date_to
        ? `${fmtDate(form.travel_date_from)} - ${fmtDate(form.travel_date_to)}`
        : form.travel_date_from ? fmtDate(form.travel_date_from)
        : "";

      const fd = new FormData();
      const submitForm = { ...form, travel_dates: combinedDates };
      Object.entries(submitForm).forEach(([k, v]) => {
        if (k !== "travel_date_from" && k !== "travel_date_to") fd.append(k, v);
      });
      fd.append("translations", JSON.stringify(translations));
      if (imageFile) fd.append("umrah_image", imageFile);

      if (isEdit) {
        await umrahAPI.packageUpdate(pkg.id, fd);
      } else {
        await umrahAPI.packageCreate(fd);
      }
      onSaved();
      onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  const isAr = activeLang === "ar";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">{isEdit ? "Edit Package" : "New Package"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Package Image</label>
            <div className="flex gap-4 items-center">
              {imagePreview && <img src={imagePreview} alt="" className="w-24 h-20 object-cover rounded-xl border" />}
              <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition">
                <Icon icon="mdi:image-plus" width={16} />
                {imagePreview ? "Change Image" : "Upload Image"}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($) <span className="text-red-500">*</span></label>
              <input type="number" min="0" step="0.01" value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
              <input type="text" value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className={inp} placeholder="e.g. 10 days" />
            </div>
          </div>

          {/* Travel Dates */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Travel Dates</label>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">From</p>
                <input type="date" value={form.travel_date_from}
                  onChange={e => setForm(p => ({ ...p, travel_date_from: e.target.value }))} className={inp} />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">To</p>
                <input type="date" value={form.travel_date_to}
                  min={form.travel_date_from || undefined}
                  onChange={e => setForm(p => ({ ...p, travel_date_to: e.target.value }))} className={inp} />
              </div>
            </div>
            {form.travel_date_from && form.travel_date_to && (
              <p className="text-xs text-blueMain mt-1.5 font-medium">
                {(() => {
                  const fmt = (iso) => { const [y,m,d] = iso.split("-"); return `${d}/${m}/${y}`; };
                  return `${fmt(form.travel_date_from)} → ${fmt(form.travel_date_to)}`;
                })()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Active</label>
              <select value={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.value }))} className={inp}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Language tabs */}
          <div>
            <div className="flex gap-2 mb-4">
              {["en", "ar"].map(lang => (
                <button key={lang} type="button" onClick={() => setActiveLang(lang)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeLang === lang ? "bg-blueMain text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {lang === "en" ? "🇬🇧 English" : "🇸🇦 Arabic"}
                </button>
              ))}
            </div>

            <div dir={isAr ? "rtl" : "ltr"} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isAr ? "العنوان" : "Title"} <span className="text-red-500">*</span>
                </label>
                <input type="text" value={trans[activeLang].title}
                  onChange={e => setT(activeLang, "title", e.target.value)}
                  className={inp} required={activeLang === "en"} />
              </div>

              {/* Description — RichText */}
              <RichText
                label={isAr ? "الوصف" : "Description"}
                value={trans[activeLang].description}
                onChange={val => setT(activeLang, "description", val)}
                dir={isAr ? "rtl" : "ltr"}
              />

              {/* Costs List — dynamic items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">{isAr ? "قائمة التكاليف" : "Costs List"}</label>
                  <button type="button" onClick={() => addCost(activeLang)}
                    className="flex items-center gap-1 text-xs font-semibold text-blueMain bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                    <Icon icon="mdi:plus" width={14} /> {isAr ? "إضافة عنصر" : "Add Item"}
                  </button>
                </div>

                {trans[activeLang].costs_list.length === 0 && (
                  <p className="text-xs text-gray-400 py-3 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    {isAr ? 'لا يوجد عناصر — اضغط "إضافة عنصر"' : 'No items yet — click "Add Item"'}
                  </p>
                )}

                <div className="space-y-2">
                  {trans[activeLang].costs_list.map((cost, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {/* order buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveCost(activeLang, idx, -1)}
                          disabled={idx === 0}
                          className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30 transition">
                          <Icon icon="mdi:chevron-up" width={12} />
                        </button>
                        <button type="button" onClick={() => moveCost(activeLang, idx, 1)}
                          disabled={idx === trans[activeLang].costs_list.length - 1}
                          className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30 transition">
                          <Icon icon="mdi:chevron-down" width={12} />
                        </button>
                      </div>

                      {/* number badge */}
                      <span className="w-6 h-6 flex-shrink-0 rounded-full bg-blueMain/10 text-blueMain text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>

                      {/* input */}
                      <input
                        type="text"
                        value={cost}
                        onChange={e => updateCost(activeLang, idx, e.target.value)}
                        placeholder={isAr ? "مثال: غرفة مزدوجة: 1,890$" : "e.g. Double room: $1,890 per person"}
                        className={inp + " flex-1"}
                        dir={isAr ? "rtl" : "ltr"}
                      />

                      {/* delete */}
                      <button type="button" onClick={() => removeCost(activeLang, idx)}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition">
                        <Icon icon="mdi:trash-can-outline" width={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
              {saving ? "Saving..." : (isEdit ? "Update Package" : "Create Package")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
