import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import ContactFormSection from "./Form.jsx";
import { contactFormAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

const LANG_LABEL = { 1: "English", 2: "Arabic" };
const strip = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

const DISPLAY_FIELDS = [
  { key: "section_title", label: "Section Title" },
  { key: "company_name", label: "Company Name" },
  { key: "description", label: "Description" },
  { key: "name_placeholder", label: "Name Placeholder" },
  { key: "email_placeholder", label: "Email Placeholder" },
  { key: "message_title_placeholder", label: "Message Title" },
  { key: "message_placeholder", label: "Message" },
  { key: "checkbox_label", label: "Checkbox Label" },
  { key: "submit_label", label: "Submit Label" },
];

export default function View() {
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(contactFormAPI.get);

  const handleSuccess = () => { refetch(); setOpenModal(false); };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-white rounded-2xl p-8 animate-pulse border border-gray-100 shadow-sm space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded-full w-3/4" />)}
        </div>
      </div>
    );
  }

  if (error) return <div className="flex-1 p-6 text-red-500 text-sm">{error}</div>;

  const translations = data?.translations || [];

  return (
    <section className="flex-1 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blueMain/10 flex items-center justify-center">
              <Icon icon="mdi:form-select" className="text-blueMain" width={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Contact Form Section</h2>
              <p className="text-xs text-gray-400">Manage contact form labels and placeholders</p>
            </div>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blueMain text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition"
          >
            <Icon icon="flowbite:edit-solid" width={15} /> Edit
          </button>
        </div>

        {translations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No data yet. Click Edit to add.</div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {translations.map((t) => (
              <div key={t.language_id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blueMain bg-blue-50 px-2 py-0.5 rounded-full mb-3">
                  {LANG_LABEL[t.language_id] || `Lang ${t.language_id}`}
                </span>
                <div className="space-y-2">
                  {DISPLAY_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{key === "description" ? (strip(t[key]) || "—") : (t[key] || "—")}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Edit Contact Form" icon="mdi:form-select">
        <ContactFormSection initialData={data} onSuccess={handleSuccess} onClose={() => setOpenModal(false)} />
      </Modal>
    </section>
  );
}
