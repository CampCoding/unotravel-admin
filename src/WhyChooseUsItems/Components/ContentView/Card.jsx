import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Card({ item, onDelete, onEdit }) {
  const id = item?.item_id || item?.id;
  const iconUrl = img(item?.item_icon);
  const title = item?.translations?.[0]?.title || "Untitled";
  const description = item?.translations?.[0]?.description || "";

  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-lime-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {iconUrl
            ? <img src={iconUrl} alt={title} className="w-8 h-8 object-contain" />
            : <Icon icon="mdi:star-check-outline" className="text-lime-500" width={24} />}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item?.item_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
            {item?.item_active ? "Active" : "Inactive"}
          </span>
          {item?.show_in_home && (
            <span className="text-[10px] text-blueMain font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Home</span>
          )}
        </div>
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-1.5 line-clamp-1">{title}</h3>
      {description && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>}
      {item?.item_key && (
        <p className="text-[10px] font-mono text-gray-400 mt-2 bg-gray-50 px-2 py-0.5 rounded-lg inline-block">{item.item_key}</p>
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
