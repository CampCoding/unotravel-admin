import React from "react";
import { Icon } from "@iconify/react";
import View from "./Components/View.jsx";

export default function OfferRegistrations() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon="mdi:clipboard-list-outline" className="text-blueMain" width={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Offer Registrations</h1>
            <p className="text-xs text-gray-400 mt-0.5">All user registrations for offers</p>
          </div>
        </div>
      </div>
      <View />
    </div>
  );
}
