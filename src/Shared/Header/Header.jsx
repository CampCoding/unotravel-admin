import { Icon } from "@iconify/react";
import React from "react";

export default function Header({ title, icon, count }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon={icon} className="text-blueMain" width={20} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-gray-800 leading-none">{title}</h1>
            {count !== undefined && (
              <p className="text-xs text-gray-400 mt-0.5">{count} items</p>
            )}
          </div>
        </div>

        {/* Right - date */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <Icon icon="mdi:calendar-outline" width={14} />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
