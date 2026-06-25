import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import AboutForm from "./Form.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { aboutAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";
import { img } from "../../utils/imageUrl.js";

export default function View() {
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(aboutAPI.get);

  const handleSuccess = () => { refetch(); setOpenModal(false); };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-white rounded-2xl p-8 animate-pulse border border-gray-100 shadow-sm">
          <div className="h-64 bg-gray-100 rounded-xl mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded-full w-1/3" />
            <div className="h-4 bg-gray-100 rounded-full w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="flex-1 p-6"><ErrorState message={error} onRetry={refetch} /></div>;

  const heroImage = img(data?.hero_image);
  const translations = data?.translations || [];

  return (
    <section className="flex-1 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-56 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
          {heroImage ? (
            <img src={heroImage} alt="About hero" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon icon="mdi:information-outline" className="text-purple-200" width={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${data?.section_active ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}`}>
              {data?.section_active ? "Active" : "Inactive"}
            </span>
          </div>
          <button onClick={() => setOpenModal(true)} className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-blueMain text-sm font-semibold rounded-xl hover:bg-white shadow-sm transition">
            <Icon icon="flowbite:edit-solid" width={15} /> Edit
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Icon icon="mdi:information-outline" className="text-purple-500" width={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">About Section</h2>
              <p className="text-xs text-gray-400">Sort order: #{data?.sort_order ?? "—"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {translations.map((t) => (
              <div key={t.language_id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blueMain bg-blue-50 px-2 py-0.5 rounded-full mb-3">
                  {t.language_id === 1 ? "English" : "Svenska"}
                </span>
                <div className="space-y-2">
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Title</p><p className="text-sm font-semibold text-gray-800">{t.title || "—"}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Subtitle</p><p className="text-sm text-gray-600">{t.subtitle || "—"}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Description</p><p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{t.description || "—"}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Edit About Section" icon="mdi:information-outline">
        <AboutForm initialData={data} onSuccess={handleSuccess} onClose={() => setOpenModal(false)} />
      </Modal>
    </section>
  );
}
