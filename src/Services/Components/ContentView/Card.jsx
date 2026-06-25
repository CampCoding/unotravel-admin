import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Card({ service, onDelete, onEdit }) {
  const id = service?.service_id || service?.id;
  const imageUrl = img(service?.service_image);
  const name = service?.translations?.[0]?.service_name || "Untitled Service";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-5 flex items-center justify-center overflow-hidden min-h-[120px]">
        {imageUrl ? (
          <img src={imageUrl} className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300" alt={name} />
        ) : (
          <Icon icon="material-symbols:linked-services" className="text-blue-200" width={48} />
        )}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button title="Edit" onClick={() => onEdit && onEdit(service)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow-sm">
            <Icon icon="flowbite:edit-solid" width={13} />
          </button>
          <button title="Delete" onClick={() => onDelete && onDelete(id)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm">
            <Icon icon="wpf:delete" width={13} />
          </button>
        </div>
        {service?.service_active !== undefined && (
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${service.service_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
            {service.service_active ? "Active" : "Inactive"}
          </span>
        )}
      </div>
      <div className="p-4">
        <h5 className="text-sm font-semibold text-gray-800 line-clamp-1 leading-snug mb-1">{name}</h5>
        {service?.service_slug && <p className="text-xs text-gray-400 mb-3">/{service.service_slug}</p>}
        <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-gray-50">
          <button onClick={() => onEdit && onEdit(service)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
            <Icon icon="flowbite:edit-solid" width={13} />
          </button>
          <button onClick={() => onDelete && onDelete(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
            <Icon icon="wpf:delete" width={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
