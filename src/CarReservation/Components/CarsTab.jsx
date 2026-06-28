import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { carReservationAPI } from "../../api/endpoints.js";

const CATEGORIES = ["ECONOMY", "SEDAN", "PREMIUM"];
const CAT_STYLE = {
  ECONOMY: "bg-emerald-100 text-emerald-700",
  SEDAN:   "bg-blue-100 text-blue-700",
  PREMIUM: "bg-amber-100 text-amber-700",
};

const EMPTY_FORM = { model: "", category: "ECONOMY", description: "", features: "", price: "", currency: "USD", rating: "4.5", popular: false, is_active: true, sort_order: "0" };

function CarModal({ initial, onClose, onSaved }) {
  const [form, setForm]     = useState(initial ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image_url ?? null);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.model || !form.price) { alert("Model and price are required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "features") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else fd.append(k, v === true ? 1 : v === false ? 0 : v);
      });
      if (imgFile) fd.append("car_image", imgFile);

      if (initial?.id) await carReservationAPI.carUpdate(initial.id, fd);
      else              await carReservationAPI.carCreate(fd);
      onSaved();
      onClose();
    } catch { alert("Save failed"); }
    finally { setSaving(false); }
  };

  const featuresStr = Array.isArray(form.features) ? form.features.join(", ") : form.features;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">{initial ? "Edit Car" : "Add Car"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Car Image</label>
            <div className="flex items-center gap-4">
              {preview && <img src={preview} alt="" className="w-24 h-16 object-cover rounded-xl border border-gray-200" onError={e => e.currentTarget.style.display = "none"} />}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition">
                <Icon icon="mdi:image-plus" width={16} /> Choose Image
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Model Name *</label>
              <input value={form.model} onChange={e => set("model", e.target.value)}
                placeholder="e.g. Chevrolet Optra 2021"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => set("currency", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30">
                {["USD","EUR","GBP","EGP","SAR","AED"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Daily Price *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="22.00"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rating (0–5)</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set("rating", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Brief description…"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Features <span className="font-normal text-gray-400">(comma-separated)</span></label>
            <input value={featuresStr} onChange={e => set("features", e.target.value)}
              placeholder="Automatic, AC, 5 Seats, GPS"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={!!form.popular} onChange={e => set("popular", e.target.checked)}
                className="w-4 h-4 rounded text-blueMain accent-blueMain" />
              Popular
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={!!form.is_active} onChange={e => set("is_active", e.target.checked)}
                className="w-4 h-4 rounded accent-blueMain" />
              Active
            </label>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CarsTab() {
  const { data: raw, loading, error, refetch } = useFetch(carReservationAPI.carsList);
  const [modal, setModal] = useState(null); // null | "new" | { car }

  const cars = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    await carReservationAPI.carDelete(id);
    refetch();
  };

  const toggleActive = async (car) => {
    const fd = new FormData();
    fd.append("is_active", car.is_active ? 0 : 1);
    await carReservationAPI.carUpdate(car.id, fd);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load fleet.</div>;

  return (
    <>
      {modal && (
        <CarModal
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={refetch}
        />
      )}

      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <Icon icon="mdi:plus" width={18} /> Add Car
          </button>
        </div>

        {cars.length === 0 && (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            No cars yet. Add one above.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map(car => (
            <div key={car.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition ${car.is_active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="relative h-40 bg-gray-100">
                {car.image_url
                  ? <img src={car.image_url} alt={car.model} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300"><Icon icon="mdi:car" width={48} /></div>
                }
                <span className={`absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${CAT_STYLE[car.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {car.category}
                </span>
                {car.popular && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">Popular</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-bold text-gray-800 truncate">{car.model}</p>
                <p className="text-xl font-black text-blueMain mt-0.5">{parseFloat(car.price).toLocaleString()} <span className="text-sm font-semibold text-gray-400">{car.currency}/day</span></p>
                {car.features?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {car.features.slice(0, 4).map(f => (
                      <span key={f} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{f}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setModal(car)} title="Edit"
                    className="flex-1 py-2 text-xs font-semibold bg-blueMain/10 hover:bg-blueMain/20 text-blueMain rounded-xl transition flex items-center justify-center gap-1.5">
                    <Icon icon="mdi:pencil-outline" width={14} /> Edit
                  </button>
                  <button onClick={() => toggleActive(car)} title={car.is_active ? "Deactivate" : "Activate"}
                    className={`px-3 py-2 rounded-xl transition text-xs font-semibold ${car.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    <Icon icon={car.is_active ? "mdi:eye" : "mdi:eye-off"} width={15} />
                  </button>
                  <button onClick={() => handleDelete(car.id)} title="Delete"
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition">
                    <Icon icon="mdi:trash-can-outline" width={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
