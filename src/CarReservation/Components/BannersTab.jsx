import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { carReservationAPI } from "../../api/endpoints.js";

const EMPTY_FORM = { title: "", subtitle: "", sort_order: "" };

export default function BannersTab() {
  const { data: raw, loading, error, refetch } = useFetch(carReservationAPI.bannersList);
  const banners = Array.isArray(raw) ? raw : [];

  // Modal state
  const [modal, setModal] = useState(false);     // "create" | "edit" | false
  const [editing, setEditing] = useState(null);  // banner object when editing
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setModal("create");
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title ?? "", subtitle: b.subtitle ?? "", sort_order: b.sort_order ?? "" });
    setFile(null);
    setPreview(b.image_url ?? null);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (modal === "create" && !file) { alert("Please select an image."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append("car_image", file);
      fd.append("title",      form.title);
      fd.append("subtitle",   form.subtitle);
      fd.append("sort_order", form.sort_order || 0);

      if (modal === "create") {
        await carReservationAPI.bannerCreate(fd);
      } else {
        await carReservationAPI.bannerUpdate(editing.id, fd);
      }
      refetch();
      closeModal();
    } catch { alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    await carReservationAPI.bannerDelete(id);
    refetch();
  };

  const toggleActive = async (b) => {
    const fd = new FormData();
    fd.append("is_active", b.is_active ? 0 : 1);
    await carReservationAPI.bannerUpdate(b.id, fd);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load banners.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Icon icon="mdi:image-plus" width={16} />
          Add Banner
        </button>
      </div>

      {banners.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          No banners yet. Add one above.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className={`relative rounded-2xl overflow-hidden border-2 transition ${b.is_active ? "border-blueMain" : "border-gray-200 opacity-60"}`}>
            <img src={b.image_url} alt="" className="w-full h-48 object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button onClick={() => openEdit(b)} title="Edit"
                className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white flex items-center justify-center text-blueMain transition">
                <Icon icon="mdi:pencil-outline" width={15} />
              </button>
              <button onClick={() => toggleActive(b)} title={b.is_active ? "Deactivate" : "Activate"}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition ${b.is_active ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"}`}>
                <Icon icon={b.is_active ? "mdi:eye" : "mdi:eye-off"} width={15} />
              </button>
              <button onClick={() => handleDelete(b.id)}
                className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition">
                <Icon icon="mdi:trash-can-outline" width={15} />
              </button>
            </div>
            {b.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
                <p className="text-white text-xs font-semibold truncate">{b.title}</p>
                {b.subtitle && <p className="text-white/70 text-xs truncate">{b.subtitle}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-base font-bold text-gray-900">
                {modal === "create" ? "Add Banner" : "Edit Banner"}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
                <Icon icon="mdi:close" width={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Banner Image {modal === "create" && <span className="text-red-500">*</span>}
                </label>
                {preview && (
                  <img src={preview} alt="preview" className="w-full h-36 object-cover rounded-xl mb-2 border" />
                )}
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blueMain rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-blueMain transition">
                  <Icon icon="mdi:upload" width={16} />
                  {file ? file.name : (modal === "edit" ? "Replace image (optional)" : "Choose image")}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Rent a Car — Anytime, Anywhere"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueMain/40"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="e.g. Flexible daily rentals with full insurance coverage"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueMain/40"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
                  placeholder="0"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueMain/40"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blueMain hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
              >
                {saving && <Icon icon="mdi:loading" className="animate-spin" width={15} />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
