import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

const PAGE_COLORS = {
  home: "bg-blue-100 text-blue-700",
  about: "bg-purple-100 text-purple-700",
  "fare-flight": "bg-indigo-100 text-indigo-700",
  "our-offers": "bg-amber-100 text-amber-700",
  contact: "bg-green-100 text-green-700",
};

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
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Page</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Section Title</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Key</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Sort</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(data || []).map((section, index) => {
            const id = section.section_id || section.id;
            const isLast = index === data.length - 1;
            const raw = section?.translations?.[0]?.section_title || "";
            const sectionTitle = raw ? raw.replace(/<[^>]*>/g, "") || section.section_key : section.section_key || "—";
            const pageColor = PAGE_COLORS[section.page_name] || "bg-gray-100 text-gray-600";
            return (
              <tr key={id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4 text-center text-gray-400 text-xs font-medium">{String(index + 1).padStart(2, "0")}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${pageColor}`}>{section.page_name || "—"}</span>
                </td>
                <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">{sectionTitle}</td>
                <td className="px-5 py-4 text-center">
                  <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">{section.section_key || "—"}</span>
                </td>
                <td className="px-5 py-4 text-center text-xs text-gray-400">#{section.sort_order ?? "—"}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${section.section_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${section.section_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {section.section_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="relative inline-block" ref={(el) => (dropdownRefs.current[index] = el)}>
                    <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blueMain hover:text-white text-gray-500 flex items-center justify-center transition">
                      <Icon icon="mdi:dots-vertical" width={16} />
                    </button>
                    {openIndex === index && (
                      <div className={`absolute right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-40 overflow-hidden ${isLast ? "bottom-full mb-2" : "mt-2"}`}>
                        <button onClick={() => { setOpenIndex(null); onEdit?.(section); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blueMain/5 hover:text-blueMain transition">
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
