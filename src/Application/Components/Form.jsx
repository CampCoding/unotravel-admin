import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { applicationAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return { language_id: id, small_title: t?.small_title || "", main_title: t?.main_title || "", description: t?.description || "" };
  });

export default function ApplicationForm({ initialData, onSuccess, onClose }) {
  const [appImageFile, setAppImageFile] = useState(null);
  const [googlePlayFile, setGooglePlayFile] = useState(null);
  const [appStoreFile, setAppStoreFile] = useState(null);
  const [googlePlayUrl, setGooglePlayUrl] = useState(initialData?.google_play_url || "");
  const [appStoreUrl, setAppStoreUrl] = useState(initialData?.app_store_url || "");
  const [active, setActive] = useState(initialData?.section_active ?? true);
  const [showInHome, setShowInHome] = useState(initialData?.show_in_home ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (appImageFile) fd.append("app_image", appImageFile);
      if (googlePlayFile) fd.append("google_play_badge", googlePlayFile);
      if (appStoreFile) fd.append("app_store_badge", appStoreFile);
      fd.append("google_play_url", googlePlayUrl);
      fd.append("app_store_url", appStoreUrl);
      fd.append("section_active", active ? "1" : "0");
      fd.append("show_in_home", showInHome ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      fd.append("translations", JSON.stringify(translations));
      await applicationAPI.update(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="App Image" value={initialData?.app_image} onChange={setAppImageFile} />
      <div className="grid grid-cols-2 gap-3">
        <FileUpload label="Google Play Badge" value={initialData?.google_play_badge} onChange={setGooglePlayFile} />
        <FileUpload label="App Store Badge" value={initialData?.app_store_badge} onChange={setAppStoreFile} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Play URL</label>
        <input type="url" value={googlePlayUrl} onChange={(e) => setGooglePlayUrl(e.target.value)} placeholder="https://play.google.com/..." className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">App Store URL</label>
        <input type="url" value={appStoreUrl} onChange={(e) => setAppStoreUrl(e.target.value)} placeholder="https://apps.apple.com/..." className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
      </div>
      <div className="border border-gray-100 rounded-xl px-4 py-1 space-y-0.5">
        <Toggle label="Active" value={active} onChange={setActive} />
        <Toggle label="Show on Home" value={showInHome} onChange={setShowInHome} />
      </div>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => {
            const ar = lang?.id === 2;
            return (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "عنوان صغير" : "Small Title"}</label>
                  <input type="text" value={t.small_title || ""} onChange={(e) => update("small_title", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "العنوان الرئيسي" : "Main Title"}</label>
                  <input type="text" value={t.main_title || ""} onChange={(e) => update("main_title", e.target.value)} className={inp} />
                </div>
                <RichText label={ar ? "الوصف" : "Description"} value={t.description || ""} onChange={(val) => update("description", val)} dir={ar ? "rtl" : "ltr"} />
              </div>
            );
          }}
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
