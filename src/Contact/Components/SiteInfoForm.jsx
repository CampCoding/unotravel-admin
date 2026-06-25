import React, { useState } from "react";
import { Icon } from "@iconify/react";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { siteSettingsAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];

const initTrans = (existing) =>
  LANGS.map(({ id }) => {
    const t = (existing || []).find((x) => x.language_id === id) || {};
    return { language_id: id, about_text: t.about_text || "", motto_title: t.motto_title || "", motto_text: t.motto_text || "" };
  });

export default function SiteInfoForm({ initialData, onSuccess, onClose }) {
  const [email,    setEmail]    = useState(initialData?.contact_email  || "");
  const [phone,    setPhone]    = useState(initialData?.contact_phone  || "");
  const [mobile,   setMobile]   = useState(initialData?.contact_mobile || "");
  const [orgNum,   setOrgNum]   = useState(initialData?.org_number     || "");
  const [mapUrl,   setMapUrl]   = useState(initialData?.map_embed_url  || "");
  const [translations, setTranslations] = useState(initTrans(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await siteSettingsAPI.update({
        contact_email:  email,
        contact_phone:  phone,
        contact_mobile: mobile,
        org_number:     orgNum,
        map_embed_url:  mapUrl,
        translations:   JSON.stringify(translations),
      });
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile</label>
          <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Org Number</label>
          <input type="text" value={orgNum} onChange={(e) => setOrgNum(e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Map Embed URL</label>
        <input type="text" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="https://maps.google.com/..." className={inp} />
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => (
            <div className="space-y-3" dir={lang?.id === 2 ? "rtl" : "ltr"}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang?.id === 2 ? "شعار العنوان" : "Motto Title"}</label>
                <input type="text" value={t.motto_title || ""} onChange={(e) => update("motto_title", e.target.value)} className={inp} />
              </div>
              <RichText label={lang?.id === 2 ? "نص الشعار" : "Motto Text"} value={t.motto_text || ""} onChange={(val) => update("motto_text", val)} dir={lang?.id === 2 ? "rtl" : "ltr"} />
              <RichText label={lang?.id === 2 ? "نبذة عن الشركة" : "About Text"} value={t.about_text || ""} onChange={(val) => update("about_text", val)} dir={lang?.id === 2 ? "rtl" : "ltr"} />
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
