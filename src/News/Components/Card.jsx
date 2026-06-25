import React from "react";
import { Icon } from "@iconify/react";
import { img } from "../../utils/imageUrl.js";

export default function Card({ article, onDelete, onEdit }) {
  const id = article?.article_id || article?.id;
  const imageUrl = img(article?.image_url || article?.thumbnail_url);
  const title = article?.translations?.[0]?.title || article?.title || "Untitled Article";
  const shortText = article?.translations?.[0]?.short_text || "";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
            <Icon icon="fluent:news-24-regular" className="text-amber-200" width={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3 gap-2">
          <button title="Edit" onClick={() => onEdit && onEdit(article)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blueMain hover:bg-blueMain hover:text-white transition shadow">
            <Icon icon="flowbite:edit-solid" width={15} />
          </button>
          <button title="Delete" onClick={() => onDelete && onDelete(id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow">
            <Icon icon="wpf:delete" width={15} />
          </button>
        </div>
        <span className="absolute top-3 left-3 bg-blueMain text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow">
          {article?.category?.translations?.[0]?.category_name || "Blog"}
        </span>
        {article?.article_active !== undefined && (
          <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${article.article_active ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
            {article.article_active ? "Active" : "Draft"}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-1.5 line-clamp-1 group-hover:text-blueMain transition-colors">{title}</h3>
        {shortText && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{shortText}</p>}
        {article?.publish_date && (
          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
            <Icon icon="mdi:calendar-outline" width={11} />
            {new Date(article.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
        <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-gray-50">
          <button onClick={() => onEdit && onEdit(article)} className="w-7 h-7 rounded-lg bg-blueMain/10 text-blueMain hover:bg-blueMain hover:text-white flex items-center justify-center transition">
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
