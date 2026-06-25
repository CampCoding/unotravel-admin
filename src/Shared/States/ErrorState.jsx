import React from "react";
import { Icon } from "@iconify/react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <Icon icon="mdi:alert-circle-outline" className="text-red-400" width={32} />
      </div>
      <p className="text-sm font-medium text-gray-600">{message || "Something went wrong"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
