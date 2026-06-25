import React from "react";
import { Icon } from "@iconify/react";

export default function Card({ category, onDelete, onEdit }) {
  const id = category?.category_id || category?.id;
  const name = category?.translations?.[0]?.category_name || "Untitled Category";

  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
          <Icon icon="mdi:tag-text-outline" className="text-orange-400" width={22} />
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          category?.category_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
        }`}>
          {category?.category_active ? "Active" : "Inactive"}
        </span>
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
      {category?.category_key && (
        <p className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded-lg inline-block">{category.category_key}</p>
      )}
      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-gray-50">
        <button onClick={() => onEdit?.(category)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
          <Icon icon="flowbite:edit-solid" width={13} />
        </button>
        <button onClick={() => onDelete?.(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
          <Icon icon="wpf:delete" width={13} />
        </button>
      </div>
    </div>
  );
}
