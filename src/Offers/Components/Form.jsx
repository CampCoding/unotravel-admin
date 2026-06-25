import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { offersAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return { language_id: id, offer_name: t?.offer_name || "", offer_description: t?.offer_description || "" };
  });

export default function OfferForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.offer_id || initialData?.id;

  const [imageFile, setImageFile] = useState(null);
  const [offerValue, setOfferValue] = useState(initialData?.offer_value || "");
  const [discountValue, setDiscountValue] = useState(initialData?.discount_value || "");
  const [discountType, setDiscountType] = useState(initialData?.discount_type || "percentage");
  const [linkUrl, setLinkUrl] = useState(initialData?.link_url || "");
  const [active, setActive] = useState(initialData?.offer_active ?? true);
  const [showInHome, setShowInHome] = useState(initialData?.show_in_home ?? false);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (imageFile) fd.append("image_url", imageFile);
      fd.append("offer_value", offerValue);
      fd.append("discount_value", discountValue);
      fd.append("discount_type", discountType);
      fd.append("link_url", linkUrl);
      fd.append("offer_active", active ? "1" : "0");
      fd.append("show_in_home", showInHome ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      fd.append("translations", JSON.stringify(translations));
      if (isEdit) await offersAPI.update(id, fd);
      else await offersAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Offer Image" value={initialData?.image_url} onChange={setImageFile} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Value</label>
          <input type="text" value={offerValue} onChange={(e) => setOfferValue(e.target.value)} placeholder="2500.00" className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount</label>
          <input type="text" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="20" className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
        <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className={inp}>
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL</label>
        <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className={inp} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "اسم العرض" : "Offer Name"}</label>
                  <input type="text" value={t.offer_name || ""} onChange={(e) => update("offer_name", e.target.value)} className={inp} />
                </div>
                <RichText label={ar ? "الوصف" : "Description"} value={t.offer_description || ""} onChange={(val) => update("offer_description", val)} dir={ar ? "rtl" : "ltr"} />
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
