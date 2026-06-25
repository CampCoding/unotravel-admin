import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../../utils/imageUrl.js";

export default function Card({ offer, onDelete, onEdit }) {
  const id = offer?.offer_id || offer?.id;
  const imageUrl = img(offer?.image_url);
  const name = offer?.translations?.[0]?.offer_name || "Untitled Offer";
  const desc = offer?.translations?.[0]?.offer_description || "";
  const discountLabel =
    offer?.discount_type === "percentage"
      ? `${offer.discount_value}% OFF`
      : `${offer.discount_value} OFF`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-44 flex items-center justify-center">
            <Icon icon="mdi:tag-multiple" className="text-amber-200" width={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3 gap-2">
          <button title="Edit" onClick={() => onEdit?.(offer)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow">
            <Icon icon="flowbite:edit-solid" width={15} />
          </button>
          <button title="Delete" onClick={() => onDelete?.(id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow">
            <Icon icon="wpf:delete" width={15} />
          </button>
        </div>
        {/* Discount badge */}
        {offer?.discount_value && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
            {discountLabel}
          </span>
        )}
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          offer?.offer_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
        }`}>
          {offer?.offer_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
        {desc && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{desc}</p>}
        {offer?.offer_value && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Icon icon="mdi:currency-usd" width={12} />
            <span>Value: <span className="font-semibold text-gray-600">{offer.offer_value}</span></span>
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <button onClick={() => onEdit?.(offer)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
              <Icon icon="flowbite:edit-solid" width={13} />
            </button>
            <button onClick={() => onDelete?.(id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition">
              <Icon icon="wpf:delete" width={13} />
            </button>
          </div>
          {offer?.show_in_home && (
            <span className="text-[10px] text-blueMain font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Home</span>
          )}
        </div>
      </div>
    </div>
  );
}
