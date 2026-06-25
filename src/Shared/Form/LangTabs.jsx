import React, { useState } from "react";

const LANGS = [
  { id: 1, label: "English", short: "EN", dir: "ltr" },
  { id: 2, label: "Arabic", short: "AR", dir: "rtl" },
];

export default function LangTabs({ values, onChange, renderFields }) {
  const [active, setActive] = useState(1);
  const current = values.find((v) => v.language_id === active) || {};
  const currentLang = LANGS.find((l) => l.id === active);

  const update = (key, val) => {
    onChange(values.map((v) => v.language_id === active ? { ...v, [key]: val } : v));
  };

  return (
    <div>
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {LANGS.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setActive(lang.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${active === lang.id ? "bg-white text-blueMain shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div dir={currentLang?.dir || "ltr"}>
        {renderFields(current, update, currentLang)}
      </div>
    </div>
  );
}
