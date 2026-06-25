import React from "react";
import { Icon } from "@iconify/react";
import View from "./Components/View.jsx";

export default function TourBookings() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blueMain/10 flex items-center justify-center">
            <Icon icon="mdi:airplane-takeoff" className="text-blueMain" width={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Tour Bookings</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage all tour reservations & payment status</p>
          </div>
        </div>
      </div>
      <View />
    </div>
  );
}
