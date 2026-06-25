import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import BannerForm from "./Form.jsx";
import { whyChooseUsBannersAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";
import { img } from "../../utils/imageUrl.js";

function Card({ banner, onEdit, onDelete }) {
  const imageUrl = img(banner?.image_url);
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" src={imageUrl} alt="Banner" />
        ) : (
          <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <Icon icon="mdi:image-outline" className="text-gray-200" width={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3 gap-2">
          <button onClick={() => onEdit(banner)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow">
            <Icon icon="flowbite:edit-solid" width={15} />
          </button>
          <button onClick={() => onDelete(banner.banner_id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow">
            <Icon icon="wpf:delete" width={15} />
          </button>
        </div>
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${banner.banner_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {banner.banner_active ? "Active" : "Inactive"}
        </span>
        {banner.show_in_home ? (
          <span className="absolute top-3 left-3 bg-blueMain text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Home</span>
        ) : null}
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">Sort: #{banner?.sort_order ?? "—"}</p>
        <div className="flex gap-1.5">
          <button onClick={() => onEdit(banner)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
            <Icon icon="flowbite:edit-solid" width={13} />
          </button>
          <button onClick={() => onDelete(banner.banner_id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
            <Icon icon="wpf:delete" width={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function View() {
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(whyChooseUsBannersAPI.list);

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try { await whyChooseUsBannersAPI.delete(id); refetch(); }
    catch { alert("Failed to delete."); }
  };

  const banners = Array.isArray(data) ? data : [];

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-700">Why Choose Us — Banners</h2>
          <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading..." : `${banners.length} banners total`}</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
          <Icon icon="mdi:plus" width={16} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-52 animate-pulse" />)}
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Icon icon="mdi:image-off-outline" width={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No banners yet</p>
          <button onClick={handleAdd} className="mt-4 text-blueMain text-sm font-medium hover:underline">+ Add Banner</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {banners.map((b) => <Card key={b.banner_id} banner={b} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>
      )}

      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Banner" : "Add Banner"} icon="mdi:image-multiple">
        <BannerForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}
