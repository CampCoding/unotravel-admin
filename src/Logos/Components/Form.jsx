import React, { useState } from "react";
import { Icon } from "@iconify/react";
import FileUpload from "../../Shared/Form/FileUpload.jsx";
import { logosAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";

export default function LogoForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.logo_id || initialData?.id;

  const [logoFile, setLogoFile] = useState(null);
  const [logoName, setLogoName] = useState(initialData?.logo_key || "");
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !logoFile) { alert("Please select a logo image."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (logoFile) fd.append("image_url", logoFile);
      fd.append("logo_key", logoName);
      fd.append("sort_order", String(sortOrder));
      if (isEdit) await logosAPI.update(id, fd);
      else await logosAPI.create(fd);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload label="Logo Image" value={initialData?.image_url} onChange={setLogoFile} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo Name</label>
        <input type="text" value={logoName} onChange={(e) => setLogoName(e.target.value)} placeholder="Partner Name" className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
        <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
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
