import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Header from "../Shared/Header/Header.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import SiteInfoSection from "./Components/SiteInfoSection.jsx";
import BranchesSection from "./Components/BranchesSection.jsx";
import NumbersSection from "./Components/NumbersSection.jsx";
import View from "./Components/View.jsx";

const TABS = [
  { key: "hero",     label: "Contact Hero",    icon: "mdi:image-area" },
  { key: "info",     label: "Site Info",       icon: "mdi:office-building-marker" },
  { key: "branches", label: "Branches",        icon: "mdi:map-marker-multiple" },
  { key: "numbers",  label: "Call Center",     icon: "mdi:phone-classic" },
  { key: "form",     label: "Contact Form",    icon: "mdi:form-select" },
];

export default function Contact() {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <>
      <Header title="Contact Page" icon="mdi:contacts" />

      {/* Tab Bar */}
      <div className="px-6 pb-0 pt-2">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? "bg-white text-blueMain shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon icon={tab.icon} width={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 space-y-6">
        {activeTab === "hero"     && <HeroSection />}
        {activeTab === "info"     && <SiteInfoSection />}
        {activeTab === "branches" && <BranchesSection />}
        {activeTab === "numbers"  && <NumbersSection />}
        {activeTab === "form"     && <View />}
      </div>
    </>
  );
}
