import React, { useState } from "react";
import { Icon } from "@iconify/react";
import BannersTab    from "./Components/BannersTab.jsx";
import CarsTab       from "./Components/CarsTab.jsx";
import FeaturesTab   from "./Components/FeaturesTab.jsx";
import HowItWorksTab from "./Components/HowItWorksTab.jsx";
import BookingsTab   from "./Components/BookingsTab.jsx";

const TABS = [
  { key: "banners",      label: "Hero Banners",  icon: "mdi:image-multiple"              },
  { key: "cars",         label: "Fleet",         icon: "mdi:car-multiple"                },
  { key: "features",     label: "Features",      icon: "mdi:star-check-outline"          },
  { key: "how-it-works", label: "How It Works",  icon: "mdi:timeline-check-outline"      },
  { key: "bookings",     label: "Bookings",      icon: "mdi:ticket-confirmation-outline" },
];

export default function CarReservation() {
  const [activeTab, setActiveTab] = useState("banners");

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blueMain/10 flex items-center justify-center">
          <Icon icon="mdi:car-key" className="text-blueMain" width={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Car Reservation</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage fleet, sections, and booking orders</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
              activeTab === t.key
                ? "border-blueMain text-blueMain bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}>
            <Icon icon={t.icon} width={16} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "banners"      && <BannersTab />}
      {activeTab === "cars"         && <CarsTab />}
      {activeTab === "features"     && <FeaturesTab />}
      {activeTab === "how-it-works" && <HowItWorksTab />}
      {activeTab === "bookings"     && <BookingsTab />}
    </div>
  );
}
