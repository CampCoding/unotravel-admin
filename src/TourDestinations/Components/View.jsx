import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { img } from "../../utils/imageUrl.js";
import Modal from "../../Shared/Modal/Modal.jsx";
import TourDestinationForm from "./Form.jsx";
import LoadingGrid from "../../Shared/States/LoadingGrid.jsx";
import EmptyState from "../../Shared/States/EmptyState.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { tourDestinationsAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

const getName = (item) =>
  item?.translations?.find((t) => t.language_id === 1)?.city_name ||
  item?.translations?.[0]?.city_name ||
  item?.destination_slug ||
  "—";

const getNameAr = (item) =>
  item?.translations?.find((t) => t.language_id === 2)?.city_name || "";

export default function View() {
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(tourDestinationsAPI.list);

  const list = Array.isArray(data) ? data : [];

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this destination?")) return;
    try { await tourDestinationsAPI.delete(id); refetch(); }
    catch { alert("Failed to delete."); }
  };

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-700">International Tours</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Loading..." : `${list.length} destination${list.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Icon icon="mdi:plus" width={16} /> Add Destination
        </button>
      </div>

      {loading && <LoadingGrid count={8} />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && list.length === 0 && (
        <EmptyState icon="mdi:map-marker-path" message="No destinations yet" action={handleAdd} actionLabel="Add Destination" />
      )}

      {!loading && !error && list.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {list.map((item) => (
            <div
              key={item.destination_id}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-36 bg-gray-100">
                {item.destination_image ? (
                  <img
                    src={img(item.destination_image)}
                    alt={getName(item)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon icon="mdi:image-off-outline" className="text-gray-300" width={32} />
                  </div>
                )}
                {/* Status badge */}
                {!item.destination_active && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-gray-800/70 text-white px-2 py-0.5 rounded-full">
                    Inactive
                  </span>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white rounded-xl text-blueMain hover:bg-blue-50 transition"
                  >
                    <Icon icon="flowbite:edit-solid" width={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.destination_id)}
                    className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-50 transition"
                  >
                    <Icon icon="mdi:trash-can-outline" width={16} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 truncate">{getName(item)}</p>
                {getNameAr(item) && (
                  <p className="text-xs text-gray-400 truncate" dir="rtl">{getNameAr(item)}</p>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  {item.destination_slug && (
                    <span className="text-[10px] text-gray-400 font-mono truncate">{item.destination_slug}</span>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto">#{item.sort_order}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Destination" : "Add Destination"} icon="mdi:map-marker-path">
        <TourDestinationForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}
