import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import { bestTravelersAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return { language_id: id, traveler_name: t?.traveler_name || "", traveler_location: t?.traveler_location || "" };
  });

export default function BestTravelerForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.traveler_id || initialData?.id;

  const [imageFile, setImageFile] = useState(null);
  const [active, setActive] = useState(initialData?.traveler_active ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (imageFile) fd.append("image_url", imageFile);
      fd.append("traveler_active", active ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      fd.append("translations", JSON.stringify(translations));
      if (isEdit) await bestTravelersAPI.update(id, fd);
      else await bestTravelersAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Photo" value={initialData?.image_url} onChange={setImageFile} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
      </div>
      <div className="border border-gray-100 rounded-xl px-4 py-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "الاسم" : "Name"}</label>
                  <input type="text" value={t.traveler_name || ""} onChange={(e) => update("traveler_name", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "الموقع / الدور" : "Location / Role"}</label>
                  <input type="text" value={t.traveler_location || ""} onChange={(e) => update("traveler_location", e.target.value)} className={inp} />
                </div>
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
