import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Card({ logo, onDelete, onEdit }) {
  const id = logo?.logo_id || logo?.id;
  const imageUrl = img(logo?.image_url);
  const name = logo?.logo_key || "Untitled Logo";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 p-6 flex items-center justify-center min-h-[130px] overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <Icon icon="mdi:image-multiple-outline" className="text-cyan-200" width={48} />
        )}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button title="Edit" onClick={() => onEdit?.(logo)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow-sm"><Icon icon="flowbite:edit-solid" width={13} /></button>
          <button title="Delete" onClick={() => onDelete?.(id)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"><Icon icon="wpf:delete" width={13} /></button>
        </div>
      </div>
      <div className="p-4">
        <h5 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{name}</h5>
        <p className="text-xs text-gray-400">Sort: #{logo?.sort_order ?? "—"}</p>
        <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-gray-50">
          <button onClick={() => onEdit?.(logo)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition"><Icon icon="flowbite:edit-solid" width={13} /></button>
          <button onClick={() => onDelete?.(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition"><Icon icon="wpf:delete" width={13} /></button>
        </div>
      </div>
    </div>
  );
}
