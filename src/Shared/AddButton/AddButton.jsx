import React from "react";
import { Icon } from "@iconify/react";

export default function AddButton({ title, icon, setOpenDrawer }) {
  return (
    <button
      onClick={() => setOpenDrawer && setOpenDrawer(true)}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blueMain/40"
    >
      <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-md">
        <Icon icon={icon || "mdi:plus"} width={14} />
      </span>
      <span>{title || "Add"}</span>
    </button>
  );
}
