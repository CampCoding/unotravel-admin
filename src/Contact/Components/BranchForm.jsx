import React, { useState } from "react";
import { Icon } from "@iconify/react";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import { companyBranchesAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];

const initTrans = (existing) =>
  LANGS.map(({ id }) => {
    const t = (existing || []).find((x) => x.language_id === id) || {};
    return { language_id: id, title: t.title || "", address_text: t.address_text || "" };
  });

export default function BranchForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const [branchKey,    setBranchKey]    = useState(initialData?.branch_key    || "");
  const [sortOrder,    setSortOrder]    = useState(initialData?.sort_order    ?? 0);
  const [branchActive, setBranchActive] = useState(initialData?.branch_active ?? true);
  const [translations, setTranslations] = useState(initTrans(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        branch_key:    branchKey,
        sort_order:    sortOrder,
        branch_active: branchActive ? 1 : 0,
        translations:  JSON.stringify(translations),
      };
      if (isEdit) await companyBranchesAPI.update(initialData.branch_id, payload);
      else        await companyBranchesAPI.create(payload);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch Key</label>
          <input type="text" value={branchKey} onChange={(e) => setBranchKey(e.target.value)} placeholder="e.g. cairo" className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
        </div>
      </div>
      <div className="border border-gray-100 rounded-xl px-4 py-1">
        <Toggle label="Active" value={!!branchActive} onChange={setBranchActive} />
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => (
            <div className="space-y-3" dir={lang?.id === 2 ? "rtl" : "ltr"}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang?.id === 2 ? "اسم الفرع" : "Branch Name"}</label>
                <input type="text" value={t.title || ""} onChange={(e) => update("title", e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang?.id === 2 ? "العنوان" : "Address"}</label>
                <textarea rows={3} value={t.address_text || ""} onChange={(e) => update("address_text", e.target.value)} className={inp + " resize-none"} />
              </div>
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
