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
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Logo</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Name</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Sort</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(data || []).map((logo, index) => {
            const id = logo.logo_id || logo.id;
            const isLast = index === data.length - 1;
            const imageUrl = img(logo.image_url);
            return (
              <tr key={id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4 text-center text-gray-400 text-xs font-medium">{String(index + 1).padStart(2, "0")}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex justify-center">
                    <div className="w-12 h-10 rounded-xl bg-cyan-50 flex items-center justify-center overflow-hidden">
                      {imageUrl
                        ? <img src={imageUrl} className="h-8 w-auto object-contain" alt={logo.logo_key} />
                        : <Icon icon="mdi:image-multiple-outline" className="text-cyan-300" width={20} />}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">{logo.logo_key || "—"}</td>
                <td className="px-5 py-4 text-center text-xs text-gray-400">#{logo.sort_order ?? "—"}</td>
                <td className="px-5 py-4 text-center">
                  <div className="relative inline-block" ref={(el) => (dropdownRefs.current[index] = el)}>
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blueMain hover:text-white text-gray-500 flex items-center justify-center transition">
                      <Icon icon="mdi:dots-vertical" width={16} />
                    </button>
                    {openIndex === index && (
                      <div className={`absolute right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-40 overflow-hidden ${isLast ? "bottom-full mb-2" : "mt-2"}`}>
                        <button onClick={() => { setOpenIndex(null); onEdit?.(logo); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blueMain/5 hover:text-blueMain transition">
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
