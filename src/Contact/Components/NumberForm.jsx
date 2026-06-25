import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import { contactNumbersAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];

const initTrans = (existing) =>
  LANGS.map(({ id }) => {
    const t = (existing || []).find((x) => x.language_id === id) || {};
    return { language_id: id, country_name: t.country_name || "" };
  });

export default function NumberForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const [flagFile,      setFlagFile]      = useState(null);
  const [phoneNumber,   setPhoneNumber]   = useState(initialData?.phone_number   || "");
  const [sortOrder,     setSortOrder]     = useState(initialData?.sort_order     ?? 0);
  const [numberActive,  setNumberActive]  = useState(initialData?.number_active  ?? true);
  const [translations,  setTranslations]  = useState(initTrans(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (flagFile) fd.append("country_flag", flagFile);
      fd.append("phone_number",   phoneNumber);
      fd.append("sort_order",     String(sortOrder));
      fd.append("number_active",  numberActive ? "1" : "0");
      fd.append("translations",   JSON.stringify(translations));
      if (isEdit) await contactNumbersAPI.update(initialData.number_id, fd);
      else        await contactNumbersAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Country Flag" value={initialData?.country_flag} onChange={setFlagFile} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 234 567 8900" className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
        </div>
      </div>
      <div className="border border-gray-100 rounded-xl px-4 py-1">
        <Toggle label="Active" value={!!numberActive} onChange={setNumberActive} />
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Country Name</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => (
            <div dir={lang?.id === 2 ? "rtl" : "ltr"}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang?.id === 2 ? "اسم الدولة" : "Country Name"}</label>
              <input type="text" value={t.country_name || ""} onChange={(e) => update("country_name", e.target.value)} className={inp} />
            </div>
          )}
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
