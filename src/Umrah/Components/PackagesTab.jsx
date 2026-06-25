import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { umrahAPI } from "../../api/endpoints.js";
import PackageForm from "./PackageForm.jsx";

export default function PackagesTab() {
  const { data: raw, loading, error, refetch } = useFetch(umrahAPI.packagesList);
  const [formPkg, setFormPkg] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const packages = Array.isArray(raw) ? raw : [];

  const openCreate = () => { setFormPkg(null); setShowForm(true); };
  const openEdit   = (pkg) => { setFormPkg(pkg); setShowForm(true); };
  const closeForm  = () => setShowForm(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    await umrahAPI.packageDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error) return <div className="text-red-500 p-4">Failed to load packages.</div>;

  return (
    <>
      {showForm && (
        <PackageForm pkg={formPkg} onClose={closeForm} onSaved={refetch} />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-500">{packages.length} package{packages.length !== 1 ? "s" : ""}</p>
          <button onClick={openCreate} className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            <Icon icon="mdi:plus" width={16} /> Add Package
          </button>
        </div>

        {packages.length === 0 && (
          <div className="text-center py-16 text-gray-400">No packages yet.</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {packages.map((pkg) => {
            const enT = pkg.translations?.find(t => t.language_id === 1) ?? {};
            const arT = pkg.translations?.find(t => t.language_id === 2) ?? {};
            return (
              <div key={pkg.id} className={`bg-gray-50 rounded-2xl overflow-hidden border ${pkg.is_active ? "border-gray-100" : "border-red-100 opacity-70"}`}>
                {pkg.image_url
                  ? <img src={pkg.image_url} alt="" className="w-full h-36 object-cover" />
                  : <div className="w-full h-36 bg-gray-200 flex items-center justify-center text-gray-400"><Icon icon="mdi:image-off" width={32} /></div>
                }
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{enT.title || "—"}</h3>
                    <span className="text-blueMain font-bold text-base shrink-0">${Number(pkg.price).toFixed(0)}</span>
                  </div>
                  {arT.title && <p className="text-xs text-gray-400 mb-2" dir="rtl">{arT.title}</p>}
                  <div className="flex gap-2 text-xs text-gray-500 flex-wrap mb-3">
                    {pkg.duration && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{pkg.duration}</span>}
                    {pkg.travel_dates && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{pkg.travel_dates}</span>}
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${pkg.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {pkg.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(pkg)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-blueMain/10 hover:bg-blueMain/20 text-blueMain rounded-xl transition">
                      <Icon icon="mdi:pencil" width={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(pkg.id)} className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition">
                      <Icon icon="mdi:trash-can-outline" width={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
