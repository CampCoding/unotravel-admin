import React, { useState, useEffect } from "react";
import Header from "../Shared/Header/Header.jsx";
import { Icon } from "@iconify/react";
import RichText from "../Shared/Form/RichText.jsx";
import { legalAPI } from "../api/endpoints.js";

const TABS = [
  { key: "terms", label: "Terms & Conditions", icon: "mdi:file-document-outline" },
  { key: "gdpr",  label: "GDPR Policy",        icon: "mdi:shield-lock-outline" },
];

function DocEditor({ slug }) {
  const [doc, setDoc]         = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle]     = useState("");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setDoc(null);
    setError(null);
    legalAPI.get(slug)
      .then(res => {
        const d = res.data?.data;
        setDoc(d);
        setContent(d?.content ?? "");
        setTitle(d?.title ?? "");
      })
      .catch(() => setError("Failed to load document."));
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await legalAPI.update(slug, { title, content });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (!doc && !error) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        <Icon icon="mdi:loading" width={28} className="animate-spin mr-2" />
        Loading…
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 py-8 text-center">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain"
        />
      </div>

      <RichText
        label="Content"
        value={content}
        onChange={setContent}
        dir="ltr"
      />

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {saving
            ? <><Icon icon="mdi:loading" width={16} className="animate-spin" /> Saving…</>
            : <><Icon icon="mdi:content-save-outline" width={16} /> Save Changes</>
          }
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <Icon icon="mdi:check-circle-outline" width={18} />
            Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}

export default function LegalDocuments() {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <>
      <Header title="Legal Documents" icon="mdi:file-document-multiple-outline" />

      <div className="p-6">
        <div className="flex gap-2 mb-5 border-b border-gray-200 pb-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                activeTab === t.key
                  ? "border-blueMain text-blueMain bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon icon={t.icon} width={16} />
              {t.label}
            </button>
          ))}
        </div>

        <DocEditor key={activeTab} slug={activeTab} />
      </div>
    </>
  );
}
