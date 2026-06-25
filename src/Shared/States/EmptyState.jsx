import React from "react";
import { Icon } from "@iconify/react";

export default function EmptyState({ icon = "mdi:inbox-outline", message = "No items found", action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon icon={icon} className="text-gray-300" width={32} />
      </div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
      {action && (
        <button
          onClick={action}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition"
        >
          {actionLabel || "Add New"}
        </button>
      )}
    </div>
  );
}
