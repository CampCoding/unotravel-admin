import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Content from "./Content.jsx";
import Modal from "../../Shared/Modal/Modal.jsx";
import ReelForm from "./Form.jsx";
import LoadingGrid from "../../Shared/States/LoadingGrid.jsx";
import EmptyState from "../../Shared/States/EmptyState.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { reelsAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

export default function View() {
  const [view, setView] = useState("grid");
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(reelsAPI.list);

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reel?")) return;
    try { await reelsAPI.delete(id); refetch(); }
    catch { alert("Failed to delete reel."); }
  };

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-700">All Reels</h2>
          <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading..." : `${data?.length ?? 0} reels total`}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${view === "grid" ? "bg-white text-blueMain shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <Icon icon="mdi:view-grid" width={15} />Grid
            </button>
            <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${view === "table" ? "bg-white text-blueMain shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <Icon icon="mdi:table" width={15} />Table
            </button>
          </div>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
            <Icon icon="mdi:plus" width={16} /> Upload Reel
          </button>
        </div>
      </div>

      {loading && <LoadingGrid count={8} />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState icon="bxs:videos" message="No reels yet" action={handleAdd} actionLabel="Upload Reel" />
      )}
      {!loading && !error && data && data.length > 0 && (
        <Content view={view} data={data} onDelete={handleDelete} onEdit={handleEdit} onRefetch={refetch} />
      )}

      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Reel" : "Upload Reel"} icon="bxs:videos">
        <ReelForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}
