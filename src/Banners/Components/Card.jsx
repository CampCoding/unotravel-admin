import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../utils/imageUrl.js";

const TYPE_COLORS = {
  page: "bg-blueMain text-white",
  service: "bg-purple-500 text-white",
};

export default function Card({ banner, onDelete, onEdit }) {
  const id = banner?.banner_id;
  const imageUrl = img(banner?.media_url);
  const typeLabel = banner?.banner_type || "page";
  const pageSlug = banner?.page_slug;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            src={imageUrl}
            alt="Banner"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <Icon icon="mdi:image-outline" className="text-gray-300" width={40} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3 gap-2">
          <button onClick={() => onEdit(banner)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow">
            <Icon icon="flowbite:edit-solid" width={15} />
          </button>
          <button onClick={() => onDelete(id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow">
            <Icon icon="wpf:delete" width={15} />
          </button>
        </div>

        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[typeLabel] || "bg-gray-500 text-white"}`}>
          {typeLabel}
        </span>
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${banner?.banner_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {banner?.banner_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="p-3 space-y-1.5">
        {pageSlug && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Icon icon="mdi:page-layout-body" width={13} className="text-blueMain" />
            <span className="font-medium">{pageSlug}</span>
          </div>
        )}
        {banner?.link_url && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
            <Icon icon="mdi:link-variant" width={13} />
            <span className="truncate">{banner.link_url}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-gray-50">
          <p className="text-xs text-gray-400">Sort: #{banner?.sort_order ?? "—"}</p>
          <div className="flex gap-1.5">
            <button onClick={() => onEdit(banner)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
              <Icon icon="flowbite:edit-solid" width={13} />
            </button>
            <button onClick={() => onDelete(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
              <Icon icon="wpf:delete" width={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
