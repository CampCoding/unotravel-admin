import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import NewsletterForm from "./Form.jsx";
import ErrorState from "../../Shared/States/ErrorState.jsx";
import { newsletterAPI } from "../../api/endpoints.js";
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

function ColorSwatch({ label, color }) {
  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 w-36 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg border border-gray-200 flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-mono text-gray-700">{color || "—"}</span>
      </div>
    </div>
  );
}

export default function View() {
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(newsletterAPI.get);

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

  const illustrationImage = img(data?.illustration_image);
  const translations = data?.translations || [];

  return (
    <section className="flex-1 p-6 space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-40 flex items-center justify-center overflow-hidden" style={{ backgroundColor: data?.bg_color || "#f3f4f6" }}>
          {illustrationImage ? (
            <img src={illustrationImage} alt="Newsletter illustration" className="h-32 w-auto object-contain" />
          ) : (
            <Icon icon="mdi:email-newsletter" className="text-white/40" width={80} />
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
          <h2 className="text-base font-bold text-gray-800 mb-4">Form & Style Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InfoRow label="Form Action URL" value={data?.form_action_url} />
              <InfoRow label="Form Method" value={data?.form_method} />
              <InfoRow label="Input Name" value={data?.input_name} />
              <InfoRow label="Input Type" value={data?.input_type} />
            </div>
            <div>
              <ColorSwatch label="Background Color" color={data?.bg_color} />
              <ColorSwatch label="Button Color" color={data?.button_color} />
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
            <div>
              <InfoRow label="Title" value={t.title} />
              <InfoRow label="Subtitle" value={t.subtitle} />
              <InfoRow label="Placeholder" value={t.input_placeholder} />
              <InfoRow label="Button Label" value={t.button_label} />
              <InfoRow label="Note 1" value={t.note_1} />
              <InfoRow label="Success Message" value={t.success_message} />
              <InfoRow label="Error Message" value={t.error_message} />
            </div>
          </div>
        ))}
      </div>
      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Edit Newsletter Section" icon="mdi:email-newsletter">
        <NewsletterForm initialData={data} onSuccess={handleSuccess} onClose={() => setOpenModal(false)} />
      </Modal>
    </section>
  );
}
