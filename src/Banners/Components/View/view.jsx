import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Content from "./Content.jsx";
import Modal from "../../../Shared/Modal/Modal.jsx";
import BannerForm from "../Form.jsx";
import { bannersAPI } from "../../../api/endpoints.js";
import { useFetch } from "../../../hooks/useFetch.js";

export default function View() {
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(bannersAPI.list);

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try { await bannersAPI.delete(id); refetch(); }
    catch { alert("Failed to delete banner."); }
  };

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-700">All Banners</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Loading..." : `${Array.isArray(data) ? data.length : 0} banners total`}
          </p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
          <Icon icon="mdi:plus" width={16} /> Add Banner
        </button>
      </div>
      <Content
        data={Array.isArray(data) ? data : []}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRefetch={refetch}
        onAdd={handleAdd}
      />
      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Banner" : "Add Banner"} icon="mdi:images">
        <BannerForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}
