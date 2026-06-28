import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { carReservationAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

export default function HeroTab() {
  const [form, setForm] = useState({
    badge_text:         "",
    title_line1:        "",
    title_highlight:    "",
    description:        "",
    cta_primary_text:   "",
    cta_secondary_text: "",
    cta_secondary_url:  "",
  });
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    carReservationAPI.heroGet()
      .then(res => {
        const d = res.data?.data;
        if (d) setForm({
          badge_text:         d.badge_text         ?? "",
          title_line1:        d.title_line1        ?? "",
          title_highlight:    d.title_highlight    ?? "",
          description:        d.description        ?? "",
          cta_primary_text:   d.cta_primary_text   ?? "",
          cta_secondary_text: d.cta_secondary_text ?? "",
          cta_secondary_url:  d.cta_secondary_url  ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await carReservationAPI.heroUpdate(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} />
    </div>
  );

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Icon icon="mdi:image-text" className="text-blueMain" width={18} />
          Hero Text Content
        </h2>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Badge Text</label>
          <input value={form.badge_text} onChange={e => set("badge_text", e.target.value)}
            placeholder="Car Rental Service" className={inp} />
          <p className="text-xs text-gray-400 mt-1">Small pill label shown above the title</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title — Line 1</label>
            <input value={form.title_line1} onChange={e => set("title_line1", e.target.value)}
              placeholder="Rent Your" className={inp} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title — Highlight (blue)</label>
            <input value={form.title_highlight} onChange={e => set("title_highlight", e.target.value)}
              placeholder="Dream Car" className={inp} />
          </div>
        </div>

        {/* Preview */}
        {(form.title_line1 || form.title_highlight) && (
          <div className="px-4 py-3 bg-gray-900 rounded-xl text-white text-lg font-black">
            {form.title_line1} <span className="text-[#3b85c1]">{form.title_highlight}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
          <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)}
            placeholder="Premium vehicles, comprehensive insurance..." className={inp + " resize-none"} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Icon icon="mdi:button-cursor" className="text-blueMain" width={18} />
          Call-to-Action Buttons
        </h2>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Primary Button Text</label>
          <input value={form.cta_primary_text} onChange={e => set("cta_primary_text", e.target.value)}
            placeholder="Browse Our Fleet" className={inp} />
          <p className="text-xs text-gray-400 mt-1">Scrolls to the fleet section — no URL needed</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Secondary Button Text</label>
            <input value={form.cta_secondary_text} onChange={e => set("cta_secondary_text", e.target.value)}
              placeholder="Call Us Now" className={inp} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Secondary Button URL</label>
            <input value={form.cta_secondary_url} onChange={e => set("cta_secondary_url", e.target.value)}
              placeholder="tel:+46..." className={inp} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60">
          {saving
            ? <><Icon icon="mdi:loading" className="animate-spin" width={16} /> Saving…</>
            : saved
              ? <><Icon icon="mdi:check-circle" width={16} /> Saved!</>
              : <><Icon icon="mdi:content-save" width={16} /> Save Changes</>
          }
        </button>
      </div>
    </form>
  );
}
