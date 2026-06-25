import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { contactHeroAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];

const initTrans = (existing) =>
  LANGS.map(({ id }) => {
    const t = (existing || []).find((x) => x.language_id === id) || {};
    return { language_id: id, title: t.title || "", description: t.description || "" };
  });

export default function HeroForm({ initialData, onSuccess, onClose }) {
  const [imageFile, setImageFile] = useState(null);
  const [sectionActive, setSectionActive] = useState(initialData?.section_active ?? 1);
  const [translations, setTranslations] = useState(initTrans(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (imageFile) fd.append("hero_image", imageFile);
      fd.append("section_active", sectionActive ? "1" : "0");
      fd.append("translations", JSON.stringify(translations));
      await contactHeroAPI.update(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Hero Image" value={initialData?.hero_image} onChange={setImageFile} />
      <div className="border border-gray-100 rounded-xl px-4 py-1">
        <Toggle label="Active" value={!!sectionActive} onChange={setSectionActive} />
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => (
            <div className="space-y-3" dir={lang?.id === 2 ? "rtl" : "ltr"}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang?.id === 2 ? "العنوان" : "Title"}</label>
                <input type="text" value={t.title || ""} onChange={(e) => update("title", e.target.value)} className={inp} />
              </div>
              <RichText label={lang?.id === 2 ? "الوصف" : "Description"} value={t.description || ""} onChange={(val) => update("description", val)} dir={lang?.id === 2 ? "rtl" : "ltr"} />
            </div>
          )}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 shadow-md shadow-blueMain/20 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
