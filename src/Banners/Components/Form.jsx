import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import { bannersAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const sel = inp + " cursor-pointer";

const PAGE_SLUGS = [
  { value: "home", label: "Home" },
  { value: "about", label: "About Us" },
  { value: "contact", label: "Contact Us" },
  { value: "fare-flight", label: "Fare Flight" },
  { value: "our-offers", label: "Our Offers" },
  { value: "blogs", label: "Blogs" },
];

export default function BannerForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.banner_id;

  const [mediaFile, setMediaFile] = useState(null);
  const [bannerType, setBannerType] = useState(initialData?.banner_type || "page");
  const [pageSlug, setPageSlug] = useState(initialData?.page_slug || "");
  const [mediaType, setMediaType] = useState(initialData?.media_type || "image");
  const [linkUrl, setLinkUrl] = useState(initialData?.link_url || "");
  const [showInHome, setShowInHome] = useState(!!initialData?.show_in_home);
  const [showInService, setShowInService] = useState(!!initialData?.show_in_service_page);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [bannerActive, setBannerActive] = useState(initialData?.banner_active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !mediaFile) { alert("Please select an image."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (mediaFile) fd.append("media_url", mediaFile);
      fd.append("banner_type", bannerType);
      fd.append("media_type", mediaType);
      if (bannerType === "page" && pageSlug) fd.append("page_slug", pageSlug);
      if (linkUrl) fd.append("link_url", linkUrl);
      fd.append("show_in_home", showInHome ? "1" : "0");
      fd.append("show_in_service_page", showInService ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      fd.append("banner_active", bannerActive ? "1" : "0");

      if (isEdit) await bannersAPI.update(id, fd);
      else await bannersAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Banner Image / Video" value={initialData?.media_url} onChange={setMediaFile} />

      {/* Type + Media Type */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Type</label>
          <select value={bannerType} onChange={(e) => setBannerType(e.target.value)} className={sel}>
            <option value="page">Page</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Media Type</label>
          <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} className={sel}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {/* Page Slug — only when type = page */}
      {bannerType === "page" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Page</label>
          <select value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} className={sel}>
            <option value="">— Select Page —</option>
            {PAGE_SLUGS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Link URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL <span className="text-gray-400 font-normal">(optional)</span></label>
        <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/services/flights" className={inp} />
      </div>

      {/* Sort Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
      </div>

      {/* Toggles */}
      <div className="border border-gray-100 rounded-xl px-4 py-1 space-y-1">
        <Toggle label="Active" value={bannerActive} onChange={setBannerActive} />
        <Toggle label="Show in Home" value={showInHome} onChange={setShowInHome} />
        <Toggle label="Show in Service Page" value={showInService} onChange={setShowInService} />
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
