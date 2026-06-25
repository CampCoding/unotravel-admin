import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import TourForm from "./Form.jsx";
import LoadingGrid from "../../Shared/States/LoadingGrid.jsx";
import EmptyState from "../../Shared/States/EmptyState.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { toursAPI, tourDestinationsAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

const getTourTitle = (item) =>
  item?.translations?.find((t) => t.language_id === 1)?.tour_title ||
  item?.translations?.[0]?.tour_title ||
  item?.tour_slug || "—";

const getDestName = (dest) =>
  dest?.translations?.find((t) => t.language_id === 1)?.city_name ||
  dest?.translations?.[0]?.city_name ||
  dest?.destination_slug || `#${dest?.destination_id}`;

export default function View() {
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filterDestId, setFilterDestId] = useState("");
  const [destinations, setDestinations] = useState([]);

  const fetchFn = filterDestId
    ? () => toursAPI.list({ destination_id: filterDestId })
    : () => toursAPI.list();

  const { data, loading, error, refetch } = useFetch(fetchFn, [filterDestId]);
  const list = Array.isArray(data) ? data : [];

  useEffect(() => {
    tourDestinationsAPI.list()
      .then((res) => setDestinations(res.data?.data ?? []))
      .catch(() => setDestinations([]));
  }, []);

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tour?")) return;
    try { await toursAPI.delete(id); refetch(); }
    catch { alert("Failed to delete tour."); }
  };

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-700">Tours</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Loading..." : `${list.length} tour${list.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Icon icon="mdi:plus" width={16} /> Add Tour
        </button>
      </div>

      {/* Destination Filter */}
      <div className="mb-5 flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter by Destination:</label>
        <select
          value={filterDestId}
          onChange={(e) => setFilterDestId(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition max-w-xs"
        >
          <option value="">All Destinations</option>
          {destinations.map((d) => (
            <option key={d.destination_id} value={d.destination_id}>
              {getDestName(d)}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingGrid count={6} />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && list.length === 0 && (
        <EmptyState icon="mdi:map-search-outline" message="No tours yet" action={handleAdd} actionLabel="Add Tour" />
      )}

      {!loading && !error && list.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Tour Title</th>
                <th className="px-4 py-3 text-left">Destination</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Pickup Extra</th>
                <th className="px-4 py-3 text-left">Max Travelers</th>
                <th className="px-4 py-3 text-left">Sort</th>
                <th className="px-4 py-3 text-left">Active</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((item) => (
                <tr key={item.tour_id} className="bg-white hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    <div>{getTourTitle(item)}</div>
                    <div className="text-xs text-gray-400 font-mono">{item.tour_slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.destination_slug || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">${Number(item.base_price ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-700">${Number(item.pickup_extra_price ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-700">{item.max_travelers}</td>
                  <td className="px-4 py-3 text-gray-500">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.tour_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {item.tour_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg text-blueMain hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Icon icon="flowbite:edit-solid" width={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.tour_id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Icon icon="mdi:trash-can-outline" width={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Tour" : "Add Tour"} icon="mdi:map-search-outline">
        <TourForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}
