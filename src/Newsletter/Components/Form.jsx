import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import { newsletterAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return {
      language_id: id,
      title: t?.title || "", subtitle: t?.subtitle || "",
      input_placeholder: t?.input_placeholder || "", button_label: t?.button_label || "",
      note_1: t?.note_1 || "", note_2: t?.note_2 || "",
      success_message: t?.success_message || "", error_message: t?.error_message || "",
    };
  });

export default function NewsletterForm({ initialData, onSuccess, onClose }) {
  const [imageFile, setImageFile] = useState(null);
  const [bgColor, setBgColor] = useState(initialData?.bg_color || "#1a1a2e");
  const [buttonColor, setButtonColor] = useState(initialData?.button_color || "#e94560");
  const [formActionUrl, setFormActionUrl] = useState(initialData?.form_action_url || "");
  const [formMethod, setFormMethod] = useState(initialData?.form_method || "POST");
  const [inputName, setInputName] = useState(initialData?.input_name || "email");
  const [inputType, setInputType] = useState(initialData?.input_type || "email");
  const [active, setActive] = useState(initialData?.section_active ?? true);
  const [showInHome, setShowInHome] = useState(initialData?.show_in_home ?? true);
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (imageFile) fd.append("illustration_image", imageFile);
      fd.append("bg_color", bgColor);
      fd.append("button_color", buttonColor);
      fd.append("form_action_url", formActionUrl);
      fd.append("form_method", formMethod);
      fd.append("input_name", inputName);
      fd.append("input_type", inputType);
      fd.append("section_active", active ? "1" : "0");
      fd.append("show_in_home", showInHome ? "1" : "0");
      fd.append("translations", JSON.stringify(translations));
      await newsletterAPI.update(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Illustration Image" value={initialData?.illustration_image} onChange={setImageFile} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Background Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className={inp} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Button Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
            <input type="text" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className={inp} />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Form Action URL</label>
        <input type="text" value={formActionUrl} onChange={(e) => setFormActionUrl(e.target.value)} placeholder="https://newsletter.example.com/subscribe" className={inp} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Form Method</label>
          <select value={formMethod} onChange={(e) => setFormMethod(e.target.value)} className={inp}>
            <option value="POST">POST</option>
            <option value="GET">GET</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Input Name</label>
          <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Input Type</label>
        <input type="text" value={inputType} onChange={(e) => setInputType(e.target.value)} placeholder="email" className={inp} />
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
            const fields = ar
              ? [["title","العنوان"],["subtitle","العنوان الفرعي"],["input_placeholder","نص الحقل"],["button_label","نص الزر"],["note_1","ملاحظة 1"],["note_2","ملاحظة 2"],["success_message","رسالة النجاح"],["error_message","رسالة الخطأ"]]
              : [["title","Title"],["subtitle","Subtitle"],["input_placeholder","Input Placeholder"],["button_label","Button Label"],["note_1","Note 1"],["note_2","Note 2"],["success_message","Success Message"],["error_message","Error Message"]];
            return (
              <div className="space-y-3">
                {fields.map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type="text" value={t[key] || ""} onChange={(e) => update(key, e.target.value)} className={inp} />
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
