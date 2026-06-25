import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Card({ agent, onDelete, onEdit }) {
  const id = agent?.agent_id || agent?.id;
  const imageUrl = img(agent?.logo_image);
  const name = agent?.agent_name || "Agent";
  const type = agent?.type || "agent";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative bg-gradient-to-br from-indigo-50 to-blue-50 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[140px]">
        {imageUrl ? (
          <div className="w-16 h-16 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-white">
            <img src={imageUrl} className="w-full h-full object-contain p-1" alt={name} />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full ring-4 ring-white shadow-md bg-blueMain/10 flex items-center justify-center">
            <Icon icon="ph:users-three-fill" className="text-blueMain/40" width={28} />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit && onEdit(agent)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow-sm">
            <Icon icon="flowbite:edit-solid" width={13} />
          </button>
          <button onClick={() => onDelete && onDelete(id)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm">
            <Icon icon="wpf:delete" width={13} />
          </button>
        </div>
        <span className={`mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${agent?.agent_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {agent?.agent_active ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="p-4 text-center">
        <h5 className="text-sm font-semibold text-gray-800 mb-0.5 line-clamp-1">{name}</h5>
        <p className="text-xs text-gray-400 mb-1 capitalize">{type}</p>
        {agent?.website_url && (
          <a href={agent.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blueMain hover:underline truncate block max-w-full">
            {agent.website_url.replace(/^https?:\/\//, "")}
          </a>
        )}
        <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-gray-50">
          <button onClick={() => onEdit && onEdit(agent)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
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
