import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { servicesAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return { language_id: id, service_name: t?.service_name || "", service_hero_title: t?.service_hero_title || "", service_description: t?.service_description || "" };
  });

export default function ServiceForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.service_id || initialData?.id;

  const [imageFile, setImageFile] = useState(null);
  const [slug, setSlug] = useState(initialData?.service_slug || "");
  const [originType, setOriginType] = useState(initialData?.service_origin_type || "internal");
  const [iframeLink, setIframeLink] = useState(initialData?.iframe_link || "");
  const [showHero, setShowHero] = useState(initialData?.show_in_home_hero ?? true);
  const [showSection, setShowSection] = useState(initialData?.show_in_home_section ?? true);
  const [active, setActive] = useState(initialData?.service_active ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (imageFile) fd.append("service_image", imageFile);
      fd.append("service_slug", slug);
      fd.append("service_origin_type", originType);
      if (originType === "external") fd.append("iframe_link", iframeLink);
      fd.append("show_in_home_hero", showHero ? "1" : "0");
      fd.append("show_in_home_section", showSection ? "1" : "0");
      fd.append("service_active", active ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      fd.append("translations", JSON.stringify(translations));
      if (isEdit) await servicesAPI.update(id, fd);
      else await servicesAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Service Image" value={initialData?.service_image} onChange={setImageFile} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="flight-booking" className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Type</label>
        <select value={originType} onChange={(e) => setOriginType(e.target.value)} className={inp}>
          <option value="internal">Internal</option>
          <option value="external">External (iFrame)</option>
        </select>
      </div>
      {originType === "external" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">iFrame Link</label>
          <input type="text" value={iframeLink} onChange={(e) => setIframeLink(e.target.value)} placeholder="https://..." className={inp} />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
      </div>
      <div className="border border-gray-100 rounded-xl px-4 py-1 space-y-0.5">
        <Toggle label="Show in Home Hero" value={showHero} onChange={setShowHero} />
        <Toggle label="Show in Home Section" value={showSection} onChange={setShowSection} />
        <Toggle label="Active" value={active} onChange={setActive} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "اسم الخدمة" : "Service Name"}</label>
                  <input type="text" value={t.service_name || ""} onChange={(e) => update("service_name", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "عنوان الهيرو" : "Hero Title"}</label>
                  <input type="text" value={t.service_hero_title || ""} onChange={(e) => update("service_hero_title", e.target.value)} className={inp} />
                </div>
                <RichText label={ar ? "الوصف" : "Description"} value={t.service_description || ""} onChange={(val) => update("service_description", val)} dir={ar ? "rtl" : "ltr"} />
              </div>
            );
          }}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 shadow-md shadow-blueMain/20 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
