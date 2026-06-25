import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { img } from "../../utils/imageUrl.js";
import Modal from "../../Shared/Modal/Modal.jsx";
import HeroForm from "./HeroForm.jsx";
import { contactHeroAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

const strip = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function HeroSection() {
  const [open, setOpen] = useState(false);
  const { data, loading, refetch } = useFetch(contactHeroAPI.get);

  const t = data?.translations?.[0] || {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon="mdi:image-area" className="text-blueMain" width={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Contact Hero</h2>
            <p className="text-xs text-gray-400">Hero banner image and title</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blueMain text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition">
          <Icon icon="flowbite:edit-solid" width={15} /> Edit
        </button>
      </div>

      {loading ? (
        <div className="p-6 animate-pulse space-y-3">
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      ) : (
        <div className="p-6 flex gap-6 flex-wrap">
          {data?.hero_image && (
            <div className="w-48 h-28 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
              <img src={img(data.hero_image)} alt="hero" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-3">
            {(data?.translations || []).map((tr) => (
              <div key={tr.language_id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blueMain bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                  {tr.language_id === 1 ? "English" : "Arabic"}
                </span>
                <p className="text-sm font-semibold text-gray-800">{tr.title || "—"}</p>
                {tr.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{strip(tr.description)}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Contact Hero" icon="mdi:image-area">
        <HeroForm initialData={data} onSuccess={() => { refetch(); setOpen(false); }} onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
