import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Content from "./Content.jsx";
import Modal from "../../Shared/Modal/Modal.jsx";
import FareFlightFeatureForm from "./Form.jsx";
import LoadingGrid from "../../Shared/States/LoadingGrid.jsx";
import EmptyState from "../../Shared/States/EmptyState.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { fareFlightFeaturesAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

export default function View() {
  const [view, setView] = useState("grid");
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(fareFlightFeaturesAPI.list);

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    try { await fareFlightFeaturesAPI.delete(id); refetch(); } catch { alert("Failed to delete feature."); }
  };

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-700">Fare Flight Features</h2>
          <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading..." : `${data?.length ?? 0} features total`}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${view === "grid" ? "bg-white text-blueMain shadow-sm" : "text-gray-500 hover:text-gray-700"}`}><Icon icon="mdi:view-grid" width={15} />Grid</button>
            <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${view === "table" ? "bg-white text-blueMain shadow-sm" : "text-gray-500 hover:text-gray-700"}`}><Icon icon="mdi:table" width={15} />Table</button>
          </div>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"><Icon icon="mdi:plus" width={16} /> Add Feature</button>
        </div>
      </div>
      {loading && <LoadingGrid count={6} />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (!data || data.length === 0) && <EmptyState icon="mdi:airplane-takeoff" message="No features yet" action={handleAdd} actionLabel="Add Feature" />}
      {!loading && !error && data && data.length > 0 && <Content view={view} data={data} onDelete={handleDelete} onEdit={handleEdit} />}
      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Feature" : "Add Feature"} icon="mdi:airplane-takeoff">
        <FareFlightFeatureForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}
