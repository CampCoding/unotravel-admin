import React, { useState } from "react";
import Header from "../Shared/Header/Header.jsx";
import { Icon } from "@iconify/react";
import BannersTab from "./Components/BannersTab.jsx";
import PackagesTab from "./Components/PackagesTab.jsx";
import RegistrationsTab from "./Components/RegistrationsTab.jsx";

const TABS = [
  { key: "packages",      label: "Packages",      icon: "mdi:kaaba" },
  { key: "banners",       label: "Banners",       icon: "mdi:image-multiple" },
  { key: "registrations", label: "Registrations", icon: "mdi:clipboard-list-outline" },
];

export default function Umrah() {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <>
      <Header title="Umrah Management" icon="mdi:kaaba" />

      {/* Tab bar */}
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

      {activeTab === "packages"      && <PackagesTab />}
      {activeTab === "banners"       && <BannersTab />}
      {activeTab === "registrations" && <RegistrationsTab />}
    </>
  );
}
