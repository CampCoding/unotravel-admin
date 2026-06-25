import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../Shared/Modal/Modal.jsx";
import SiteInfoForm from "./SiteInfoForm.jsx";
import { siteSettingsAPI } from "../../api/endpoints.js";
import { useFetch } from "../../hooks/useFetch.js";

const Field = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-blueMain/8 flex items-center justify-center shrink-0 mt-0.5">
      <Icon icon={icon} className="text-blueMain" width={14} />
    </div>
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-sm text-gray-700 break-all">{value || "—"}</p>
    </div>
  </div>
);

const strip = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function SiteInfoSection() {
  const [open, setOpen] = useState(false);
  const { data, loading, refetch } = useFetch(siteSettingsAPI.get);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon="mdi:office-building-marker" className="text-blueMain" width={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Site Info</h2>
            <p className="text-xs text-gray-400">Contact details, map and organisation info</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blueMain text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition">
          <Icon icon="flowbite:edit-solid" width={15} /> Edit
        </button>
      </div>

      {loading ? (
        <div className="p-6 animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded w-3/4" />)}
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Details</p>
            <Field icon="mdi:email-outline"  label="Email"  value={data?.contact_email} />
            <Field icon="mdi:phone-outline"  label="Phone"  value={data?.contact_phone} />
            <Field icon="mdi:cellphone"      label="Mobile" value={data?.contact_mobile} />
            <Field icon="mdi:identifier"     label="Org Number" value={data?.org_number} />
            <Field icon="mdi:map-marker-outline" label="Map Embed URL" value={data?.map_embed_url} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
            {(data?.translations || []).map((tr) => (
              <div key={tr.language_id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blueMain bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                  {tr.language_id === 1 ? "English" : "Arabic"}
                </span>
                {tr.motto_title && <p className="text-sm font-semibold text-gray-800">{tr.motto_title}</p>}
                {tr.motto_text && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{strip(tr.motto_text)}</p>}
                {tr.about_text && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{strip(tr.about_text)}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Site Info" icon="mdi:office-building-marker">
        <SiteInfoForm initialData={data} onSuccess={() => { refetch(); setOpen(false); }} onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
