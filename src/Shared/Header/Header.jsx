import { Icon } from "@iconify/react";
import React from "react";

export default function Header({ title, icon }) {
  return (
    <>
      <header className="flex items-center gap-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 shadow-sm">
        {/* Icon */}
        <Icon icon={`${icon}`} />

        {/* Page Title */}
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
      </header>
    </>
  );
}
