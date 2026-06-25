import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function TableView({ data, onDelete, onEdit }) {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRefs.current.some((r) => r?.contains(e.target))) setOpenIndex(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">#</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Photo</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Name</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Title</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(data || []).map((traveler, index) => {
            const id = traveler.traveler_id || traveler.id;
            const isLast = index === data.length - 1;
            const name = traveler?.translations?.[0]?.traveler_name || "—";
            const title = traveler?.translations?.[0]?.traveler_location || "—";
            const imageUrl = img(traveler.image_url);
            return (
              <tr key={id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4 text-center text-gray-400 text-xs font-medium">{String(index + 1).padStart(2, "0")}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-teal-50 flex items-center justify-center">
                      {imageUrl
                        ? <img src={imageUrl} className="w-10 h-10 object-cover" alt={name} />
                        : <Icon icon="mdi:account-star-outline" className="text-teal-400" width={20} />}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">{name}</td>
                <td className="px-5 py-4 text-center text-xs text-blueMain font-medium">{title}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${traveler.traveler_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${traveler.traveler_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {traveler.traveler_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="relative inline-block" ref={(el) => (dropdownRefs.current[index] = el)}>
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blueMain hover:text-white text-gray-500 flex items-center justify-center transition">
                      <Icon icon="mdi:dots-vertical" width={16} />
                    </button>
                    {openIndex === index && (
                      <div className={`absolute right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-40 overflow-hidden ${isLast ? "bottom-full mb-2" : "mt-2"}`}>
                        <button onClick={() => { setOpenIndex(null); onEdit?.(traveler); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blueMain/5 hover:text-blueMain transition">
                          <Icon icon="flowbite:edit-solid" width={15} className="text-blueMain" />Edit
                        </button>
                        <button onClick={() => { setOpenIndex(null); onDelete?.(id); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
                          <Icon icon="wpf:delete" width={15} className="text-red-500" />Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
