import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import RichText from "../../Shared/Form/RichText.jsx";
import { pageSectionsAPI } from "../../api/endpoints.js";

const LANG_ID = 1;

export default function ContentTab() {
  const [sectionId, setSectionId] = useState(null);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    pageSectionsAPI.list("visa")
      .then(res => {
        const sections = res.data?.data ?? [];
        const intro = sections.find(s => s.section_key === "intro");
        if (intro) {
          setSectionId(intro.section_id);
          const t = (intro.translations || []).find(t => t.language_id === LANG_ID) || {};
          setTitle(t.section_title || "");
          setDescription(t.section_description || "");
        }
      })
      .catch(() => setError("Failed to load content."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        page_name: "visa",
        section_key: "intro",
        section_active: 1,
        translations: [{ language_id: LANG_ID, section_title: title, section_subtitle: "", section_description: description }],
      };
      if (sectionId) {
        await pageSectionsAPI.update(sectionId, payload);
      } else {
        const res = await pageSectionsAPI.create(payload);
        setSectionId(res.data?.data?.section_id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-gray-400">
      <Icon icon="mdi:loading" width={28} className="animate-spin mr-2" />
      Loading…
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain"
          placeholder="Get A Visa With Uno Travel"
        />
      </div>

      <RichText
        label="Description"
        value={description}
        onChange={setDescription}
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
