import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import Toggle from "../../Shared/Form/Toggle.jsx";
import { whyChooseUsBannersAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

export default function WhyChooseUsBannerForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.banner_id;

  const [imageFile, setImageFile] = useState(null);
  const [bannerActive, setBannerActive] = useState(initialData?.banner_active ?? true);
  const [showInHome, setShowInHome] = useState(initialData?.show_in_home ?? false);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !imageFile) { alert("Please select an image."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (imageFile) fd.append("image_url", imageFile);
      fd.append("banner_active", bannerActive ? "1" : "0");
      fd.append("show_in_home", showInHome ? "1" : "0");
      fd.append("sort_order", String(sortOrder));
      if (isEdit) await whyChooseUsBannersAPI.update(id, fd);
      else await whyChooseUsBannersAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FileUpload label="Banner Image" value={initialData?.image_url} onChange={setImageFile} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
      </div>
      <div className="border border-gray-100 rounded-xl px-4 py-1 space-y-1">
        <Toggle label="Active" value={bannerActive} onChange={setBannerActive} />
        <Toggle label="Show in Home" value={showInHome} onChange={setShowInHome} />
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
