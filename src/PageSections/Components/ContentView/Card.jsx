import React from "react";
import { Icon } from "@iconify/react";

const PAGE_COLORS = {
  home: "bg-blue-100 text-blue-700",
  about: "bg-purple-100 text-purple-700",
  "fare-flight": "bg-indigo-100 text-indigo-700",
  "our-offers": "bg-amber-100 text-amber-700",
  contact: "bg-green-100 text-green-700",
};

export default function Card({ section, onDelete, onEdit }) {
  const id = section?.section_id || section?.id;
  const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, "") : "";
  const sectionTitle = stripHtml(section?.translations?.[0]?.section_title) || section?.section_key || "Untitled Section";
  const subtitle = stripHtml(section?.translations?.[0]?.section_subtitle) || "";
  const pageName = section?.page_name || "";
  const pageColor = PAGE_COLORS[pageName] || "bg-gray-100 text-gray-600";

  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${pageColor}`}>
          {pageName || "—"}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${section?.section_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {section?.section_active ? "Active" : "Inactive"}
        </span>
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{sectionTitle}</h3>
      {subtitle && <p className="text-xs text-gray-500 mb-2 line-clamp-1">{subtitle}</p>}
      {section?.section_key && (
        <p className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg inline-block">{section.section_key}</p>
      )}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <span className="text-[10px] text-gray-400">Sort: #{section?.sort_order ?? "—"}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit?.(section)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
            <Icon icon="flowbite:edit-solid" width={13} />
          </button>
          <button onClick={() => onDelete?.(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
            <Icon icon="wpf:delete" width={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
