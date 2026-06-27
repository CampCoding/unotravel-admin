import React, { useState } from "react";
import Header from "../Shared/Header/Header.jsx";
import { Icon } from "@iconify/react";
import BannersTab from "./Components/BannersTab.jsx";
import FeaturesTab from "./Components/FeaturesTab.jsx";

const TABS = [
  { key: "banners",  label: "Banners",  icon: "mdi:image-multiple" },
  { key: "features", label: "Features", icon: "mdi:star-circle-outline" },
];

export default function IntlTours() {
  const [activeTab, setActiveTab] = useState("banners");

  return (
    <>
      <Header title="International Tours" icon="mdi:earth" />

      <div className="p-6">
        <div className="flex gap-2 mb-5 border-b border-gray-200 pb-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                activeTab === t.key
                  ? "border-blueMain text-blueMain bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon icon={t.icon} width={16} />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "banners"  && <BannersTab />}
        {activeTab === "features" && <FeaturesTab />}
      </div>
    </>
  );
}
