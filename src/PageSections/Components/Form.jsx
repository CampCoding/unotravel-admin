import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { pageSectionsAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return {
      language_id: id,
      section_title: t?.section_title || "",
      section_subtitle: t?.section_subtitle || "",
      section_description: t?.section_description || "",
    };
  });

export default function PageSectionForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.section_id || initialData?.id;

  const [pageName, setPageName] = useState(initialData?.page_name || "home");
  const [sectionKey, setSectionKey] = useState(initialData?.section_key || "");
  const [active, setActive] = useState(initialData?.section_active ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        page_name: pageName,
        section_key: sectionKey,
        section_active: active ? 1 : 0,
        sort_order: Number(sortOrder),
        translations,
      };
      if (isEdit) await pageSectionsAPI.update(id, body);
      else await pageSectionsAPI.create(body);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Page</label>
          <select value={pageName} onChange={(e) => setPageName(e.target.value)} className={inp}>
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="fare-flight">Fare Flight</option>
            <option value="our-offers">Our Offers</option>
            <option value="contact">Contact</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Key</label>
          <input type="text" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} placeholder="hero" className={inp} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
        </div>
        <div className="border border-gray-100 rounded-xl px-4 py-1">
          <Toggle label="Active" value={active} onChange={setActive} />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => {
            const ar = lang?.id === 2;
            const dir = lang?.dir || "ltr";
            return (
              <div className="space-y-4">
                <RichText
                  label={ar ? "عنوان القسم" : "Section Title"}
                  value={t.section_title || ""}
                  onChange={(val) => update("section_title", val)}
                  dir={dir}
                />
                <RichText
                  label={ar ? "العنوان الفرعي للقسم" : "Section Subtitle"}
                  value={t.section_subtitle || ""}
                  onChange={(val) => update("section_subtitle", val)}
                  dir={dir}
                />
                <RichText
                  label={ar ? "الوصف" : "Description"}
                  value={t.section_description || ""}
                  onChange={(val) => update("section_description", val)}
                  dir={dir}
                />
              </div>
            );
          }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 shadow-md shadow-blueMain/20 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
