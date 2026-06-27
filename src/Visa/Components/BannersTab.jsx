import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { visaAPI } from "../../api/endpoints.js";

export default function BannersTab() {
  const { data: raw, loading, error, refetch } = useFetch(visaAPI.bannersList);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const banners = Array.isArray(raw) ? raw : [];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("visa_image", file);
      await visaAPI.bannerCreate(fd);
      refetch();
    } catch { alert("Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    await visaAPI.bannerDelete(id);
    refetch();
  };

  const toggleActive = async (banner) => {
    const fd = new FormData();
    fd.append("is_active", banner.is_active ? 0 : 1);
    await visaAPI.bannerUpdate(banner.id, fd);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load banners.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <label className="flex items-center gap-2 cursor-pointer bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          {uploading
            ? <><Icon icon="mdi:loading" className="animate-spin" width={16} /> Uploading...</>
            : <><Icon icon="mdi:image-plus" width={16} /> Upload Banner</>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {banners.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          No banners yet. Upload one above.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className={`relative rounded-2xl overflow-hidden border-2 transition ${b.is_active ? "border-blueMain" : "border-gray-200 opacity-60"}`}>
            <img src={b.image_url} alt="" className="w-full h-48 object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button onClick={() => toggleActive(b)} title={b.is_active ? "Deactivate" : "Activate"}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition ${b.is_active ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"}`}>
                <Icon icon={b.is_active ? "mdi:eye" : "mdi:eye-off"} width={15} />
              </button>
              <button onClick={() => handleDelete(b.id)}
                className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition">
                <Icon icon="mdi:trash-can-outline" width={15} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
              <p className="text-white text-xs font-semibold truncate">{b.title || `Banner #${b.id}`}</p>
              {b.subtitle && <p className="text-white/70 text-xs truncate">{b.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
