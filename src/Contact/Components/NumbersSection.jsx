import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { img } from "../../utils/imageUrl.js";
import Modal from "../../Shared/Modal/Modal.jsx";
import NumberForm from "./NumberForm.jsx";
import { contactNumbersAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

export default function NumbersSection() {
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data: numbers, loading, refetch } = useFetch(contactNumbersAPI.list);

  const list = Array.isArray(numbers) ? numbers : [];

  const openAdd  = () => { setSelected(null); setOpenModal(true); };
  const openEdit = (n) => { setSelected(n);    setOpenModal(true); };
  const close    = () => { setSelected(null); setOpenModal(false); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this number?")) return;
    try { await contactNumbersAPI.delete(id); refetch(); }
    catch { alert("Failed to delete."); }
  };

  const getName = (n) =>
    n?.translations?.find((t) => t.language_id === 1)?.country_name ||
    n?.translations?.[0]?.country_name || "—";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon="mdi:phone-classic" className="text-blueMain" width={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Call Center Numbers</h2>
            <p className="text-xs text-gray-400">{list.length} number{list.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blueMain text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition">
          <Icon icon="mdi:plus" width={16} /> Add Number
        </button>
      </div>

      {loading ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">No numbers yet. Click Add Number.</div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((n) => (
            <div key={n.number_id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
              {n.country_flag ? (
                <img src={img(n.country_flag)} alt="flag" className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                  <Icon icon="mdi:flag-outline" className="text-gray-400" width={16} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{getName(n)}</p>
                <p className="text-xs text-gray-500">{n.phone_number || "—"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg hover:bg-blueMain/10 text-blueMain transition">
                  <Icon icon="flowbite:edit-solid" width={14} />
                </button>
                <button onClick={() => handleDelete(n.number_id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition">
                  <Icon icon="mdi:trash-can-outline" width={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={openModal} onClose={close} title={selected ? "Edit Number" : "Add Number"} icon="mdi:phone-classic">
        <NumberForm initialData={selected} onSuccess={() => { refetch(); close(); }} onClose={close} />
      </Modal>
    </div>
  );
}
