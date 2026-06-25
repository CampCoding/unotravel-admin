import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import ApplicationForm from "./Form.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { applicationAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";
import { img } from "../../utils/imageUrl.js";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-700 break-all">{value || "—"}</span>
    </div>
  );
}

export default function View() {
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(applicationAPI.get);

  const handleSuccess = () => { refetch(); setOpenModal(false); };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-white rounded-2xl p-8 animate-pulse border border-gray-100 shadow-sm space-y-4">
          <div className="h-40 bg-gray-100 rounded-xl" />
          <div className="h-4 bg-gray-100 rounded-full w-1/2" />
          <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        </div>
      </div>
    );
  }

  if (error) return <div className="flex-1 p-6"><ErrorState message={error} onRetry={refetch} /></div>;

  const appImage = img(data?.app_image);
  const googlePlayBadge = img(data?.google_play_badge);
  const appStoreBadge = img(data?.app_store_badge);
  const translations = data?.translations || [];

  return (
    <section className="flex-1 p-6 space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden">
          {appImage ? (
            <img src={appImage} alt="App" className="h-40 w-auto object-contain" />
          ) : (
            <Icon icon="mdi:cellphone" className="text-cyan-200" width={80} />
          )}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${data?.section_active ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}`}>
              {data?.section_active ? "Active" : "Inactive"}
            </span>
            {data?.show_in_home && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blueMain text-white">Show on Home</span>}
          </div>
          <button onClick={() => setOpenModal(true)} className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-blueMain text-sm font-semibold rounded-xl hover:bg-white shadow-sm transition">
            <Icon icon="flowbite:edit-solid" width={15} /> Edit
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Store Links & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InfoRow label="Google Play URL" value={data?.google_play_url} />
              <InfoRow label="App Store URL" value={data?.app_store_url} />
              <InfoRow label="Sort Order" value={data?.sort_order?.toString()} />
            </div>
            <div className="flex items-center gap-6">
              {googlePlayBadge && (
                <div className="flex flex-col items-center gap-1">
                  <img src={googlePlayBadge} alt="Google Play" className="h-10 object-contain" />
                  <span className="text-[10px] text-gray-400">Google Play Badge</span>
                </div>
              )}
              {appStoreBadge && (
                <div className="flex flex-col items-center gap-1">
                  <img src={appStoreBadge} alt="App Store" className="h-10 object-contain" />
                  <span className="text-[10px] text-gray-400">App Store Badge</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {translations.map((t) => (
          <div key={t.language_id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blueMain bg-blue-50 px-2 py-0.5 rounded-full mb-4">
              {t.language_id === 1 ? "English" : "Svenska"}
            </span>
            <div className="space-y-2.5">
              <InfoRow label="Small Title" value={t.small_title} />
              <InfoRow label="Main Title" value={t.main_title} />
              <InfoRow label="Description" value={t.description} />
            </div>
          </div>
        ))}
      </div>
      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Edit Application Section" icon="mdi:cellphone">
        <ApplicationForm initialData={data} onSuccess={handleSuccess} onClose={() => setOpenModal(false)} />
      </Modal>
    </section>
  );
}
