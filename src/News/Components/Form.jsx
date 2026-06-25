import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { newsAPI, newsCategoriesAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];
const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return { language_id: id, title: t?.title || "", short_text: t?.short_text || "", content_html: t?.content_html || "" };
  });

export default function ArticleForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.article_id || initialData?.id;

  const { data: categories } = useFetch(newsCategoriesAPI.list);

  const [imageFile, setImageFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [categoryId, setCategoryId] = useState(initialData?.category_id || initialData?.category?.category_id || "");
  const [publishDate, setPublishDate] = useState(initialData?.publish_date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [active, setActive] = useState(initialData?.article_active ?? true);
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
      if (heroFile) fd.append("hero_image_url", heroFile);
      if (thumbFile) fd.append("thumbnail_url", thumbFile);
      if (categoryId) fd.append("category_id", String(categoryId));
      fd.append("publish_date", publishDate);
      fd.append("article_active", active ? "1" : "0");
      fd.append("show_in_home", showInHome ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      fd.append("translations", JSON.stringify(translations));
      if (isEdit) await newsAPI.update(id, fd);
      else await newsAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Cover Image" value={initialData?.image_url} onChange={setImageFile} />
      <FileUpload label="Hero Image" value={initialData?.hero_image_url} onChange={setHeroFile} />
      <FileUpload label="Thumbnail" value={initialData?.thumbnail_url} onChange={setThumbFile} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inp}>
          <option value="">Select category...</option>
          {(categories || []).map((cat) => (
            <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
              {cat.translations?.[0]?.category_name || cat.category_key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date</label>
        <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className={inp} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "العنوان" : "Title"}</label>
                  <input type="text" value={t.title || ""} onChange={(e) => update("title", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "نص قصير" : "Short Text"}</label>
                  <textarea rows={2} value={t.short_text || ""} onChange={(e) => update("short_text", e.target.value)} className={inp + " resize-none"} />
                </div>
                <RichText label={ar ? "المحتوى" : "Content"} value={t.content_html || ""} onChange={(val) => update("content_html", val)} dir={ar ? "rtl" : "ltr"} />
              </div>
            );
          }}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 shadow-md shadow-blueMain/20 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
          {saving ? "Saving..." : isEdit ? "Update" : "Publish"}
        </button>
      </div>
    </form>
  );
}
