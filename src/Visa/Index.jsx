import React, { useState } from "react";
import Header from "../Shared/Header/Header.jsx";
import { Icon } from "@iconify/react";
import BannersTab      from "./Components/BannersTab.jsx";
import ContentTab      from "./Components/ContentTab.jsx";
import CountriesTab    from "./Components/CountriesTab.jsx";
import VisaTypesTab    from "./Components/VisaTypesTab.jsx";
import PassportTypesTab from "./Components/PassportTypesTab.jsx";
import ApplicationsTab from "./Components/ApplicationsTab.jsx";

const TABS = [
  { key: "banners",       label: "Banners",       icon: "mdi:image-multiple"      },
  { key: "content",       label: "Content",       icon: "mdi:text-box-outline"    },
  { key: "countries",     label: "Countries",     icon: "mdi:earth"               },
  { key: "visa-types",    label: "Visa Types",    icon: "mdi:passport"            },
  { key: "passport-types",label: "Passport Types",icon: "mdi:card-account-details-outline" },
  { key: "applications",  label: "Applications",  icon: "mdi:clipboard-list-outline" },
];

export default function VisaAdmin() {
  const [activeTab, setActiveTab] = useState("banners");

  return (
    <>
      <Header title="Visa Services" icon="mdi:passport" />

      <div className="p-6">
        <div className="flex gap-2 mb-5 border-b border-gray-200">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                activeTab === t.key
                  ? "border-blueMain text-blueMain bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <Icon icon={t.icon} width={16} />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "banners"        && <BannersTab />}
        {activeTab === "content"        && <ContentTab />}
        {activeTab === "countries"      && <CountriesTab />}
        {activeTab === "visa-types"     && <VisaTypesTab />}
        {activeTab === "passport-types" && <PassportTypesTab />}
        {activeTab === "applications"   && <ApplicationsTab />}
      </div>
    </>
  );
}
