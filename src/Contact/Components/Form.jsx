import React, { useState } from "react";
import { Icon } from "@iconify/react";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { contactFormAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

const LANGS = [{ id: 1 }, { id: 2 }];

const FIELDS = [
  { key: "section_title", label: "Section Title", ar: "عنوان القسم" },
  { key: "company_name", label: "Company Name", ar: "اسم الشركة" },
  { key: "description", label: "Description", ar: "الوصف" },
  { key: "name_placeholder", label: "Name Placeholder", ar: "نص حقل الاسم" },
  { key: "email_placeholder", label: "Email Placeholder", ar: "نص حقل البريد" },
  { key: "message_title_placeholder", label: "Message Title Placeholder", ar: "نص حقل عنوان الرسالة" },
  { key: "message_placeholder", label: "Message Placeholder", ar: "نص حقل الرسالة" },
  { key: "checkbox_label", label: "Checkbox Label", ar: "نص خانة الاختيار" },
  { key: "submit_label", label: "Submit Button Label", ar: "نص زر الإرسال" },
];

const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id) || {};
    return {
      language_id: id,
      section_title: t.section_title || "",
      company_name: t.company_name || "",
      description: t.description || "",
      name_placeholder: t.name_placeholder || "",
      email_placeholder: t.email_placeholder || "",
      message_title_placeholder: t.message_title_placeholder || "",
      message_placeholder: t.message_placeholder || "",
      checkbox_label: t.checkbox_label || "",
      submit_label: t.submit_label || "",
    };
  });

export default function ContactFormSection({ initialData, onSuccess, onClose }) {
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await contactFormAPI.update({ translations });
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => {
            const ar = lang?.id === 2;
            return (
              <div className="space-y-3">
                {FIELDS.map(({ key, label, ar: arLabel }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? arLabel : label}</label>
                    {key === "description" ? (
                      <RichText value={t[key] || ""} onChange={(val) => update(key, val)} dir={ar ? "rtl" : "ltr"} />
                    ) : (
                      <input type="text" value={t[key] || ""} onChange={(e) => update(key, e.target.value)} className={inp} />
                    )}
                  </div>
                ))}
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
