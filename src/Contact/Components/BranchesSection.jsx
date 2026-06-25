import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import BranchForm from "./BranchForm.jsx";
import { companyBranchesAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

export default function BranchesSection() {
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data: branches, loading, refetch } = useFetch(companyBranchesAPI.list);

  const list = Array.isArray(branches) ? branches : [];

  const openAdd  = () => { setSelected(null); setOpenModal(true); };
  const openEdit = (b) => { setSelected(b);    setOpenModal(true); };
  const close    = () => { setSelected(null); setOpenModal(false); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this branch?")) return;
    try { await companyBranchesAPI.delete(id); refetch(); }
    catch { alert("Failed to delete."); }
  };

  const getTitle = (b) => b?.translations?.find((t) => t.language_id === 1)?.title
    || b?.translations?.[0]?.title || b?.branch_key || "Branch";
  const getAddr  = (b) => b?.translations?.find((t) => t.language_id === 1)?.address_text
    || b?.translations?.[0]?.address_text || "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon="mdi:map-marker-multiple" className="text-blueMain" width={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Company Branches</h2>
            <p className="text-xs text-gray-400">{list.length} branch{list.length !== 1 ? "es" : ""}</p>
          </div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blueMain text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition">
          <Icon icon="mdi:plus" width={16} /> Add Branch
        </button>
      </div>

      {loading ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">No branches yet. Click Add Branch.</div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((b) => (
            <div key={b.branch_id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-blueMain/10 flex items-center justify-center shrink-0">
                <Icon icon="mdi:office-building" className="text-blueMain" width={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-800 truncate">{getTitle(b)}</p>
                  {!b.branch_active && (
                    <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                {getAddr(b) && <p className="text-xs text-gray-500 line-clamp-2">{getAddr(b)}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-blueMain/10 text-blueMain transition">
                  <Icon icon="flowbite:edit-solid" width={14} />
                </button>
                <button onClick={() => handleDelete(b.branch_id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition">
                  <Icon icon="mdi:trash-can-outline" width={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={openModal} onClose={close} title={selected ? "Edit Branch" : "Add Branch"} icon="mdi:map-marker-multiple">
        <BranchForm initialData={selected} onSuccess={() => { refetch(); close(); }} onClose={close} />
      </Modal>
    </div>
  );
}
