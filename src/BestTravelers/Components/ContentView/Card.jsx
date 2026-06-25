import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Card({ traveler, onDelete, onEdit }) {
  const id = traveler?.traveler_id || traveler?.id;
  const imageUrl = img(traveler?.image_url);
  const name = traveler?.translations?.[0]?.traveler_name || "Unknown";
  const title = traveler?.translations?.[0]?.traveler_location || "";
  const description = "";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
              <Icon icon="mdi:account-star-outline" className="text-teal-400" width={36} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3 gap-2">
          <button title="Edit" onClick={() => onEdit?.(traveler)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow">
            <Icon icon="flowbite:edit-solid" width={15} />
          </button>
          <button title="Delete" onClick={() => onDelete?.(id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow">
            <Icon icon="wpf:delete" width={15} />
          </button>
        </div>
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${traveler?.traveler_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {traveler?.traveler_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-0.5 line-clamp-1">{name}</h3>
        {title && <p className="text-xs font-medium text-blueMain mb-1">{title}</p>}
        {description && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>}
        <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-gray-50">
          <button onClick={() => onEdit?.(traveler)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
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
