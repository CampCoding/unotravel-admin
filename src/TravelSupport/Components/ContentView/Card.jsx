import React from "react";
import { Icon } from "@iconify/react";

export default function Card({ item, onDelete, onEdit }) {
  const id = item?.id;
  const title = item?.translations?.[0]?.title || "Untitled";
  const description = item?.translations?.[0]?.description || "";
  // item_icon is a font-awesome class string e.g. "fa-headset"
  const iconClass = item?.item_icon;

  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
          {iconClass
            ? <i className={`fa ${iconClass} text-sky-500 text-xl`} />
            : <Icon icon="mdi:lifebuoy" className="text-sky-500" width={24} />}
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item?.item_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {item?.item_active ? "Active" : "Inactive"}
        </span>
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-1.5 line-clamp-1">{title}</h3>
      {description && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>}
      {iconClass && (
        <p className="text-[10px] font-mono text-gray-400 mt-2 bg-gray-50 px-2 py-0.5 rounded-lg inline-block">{iconClass}</p>
      )}
      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-gray-50">
        <button onClick={() => onEdit?.(item)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
          <Icon icon="flowbite:edit-solid" width={13} />
        </button>
        <button onClick={() => onDelete?.(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
          <Icon icon="wpf:delete" width={13} />
        </button>
      </div>
    </div>
  );
}
