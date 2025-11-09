import React, { Activity, useCallback, useState } from "react";

import LinksSection from "./Links/LinksSection.jsx";

export default function Links() {
  const tabs = ["Site Links", "Social Media Links"];
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const handleSubmit = useCallback(() => {
    console.log("submit");
  }, []);
  const appLinks = [
    {
      id: 1,
      label: "Google Play",
      placeholder: "https://play.google.com/...",
      value: "https://play.google.com/...",
    },
    { id: 2, label: "App Store", placeholder: "https://apps.apple.com/..." },
    {
      id: 3,
      label: "Huawei App Gallery",
      placeholder: "https://appgallery.huawei.com/...",
    },
  ];

  const socialLinks = [
    {
      id: 1,
      label: "Facebook",
      placeholder: "https://facebook.com/yourpage",
      value: "https://facebook.com/yourpage",
    },
    {
      id: 2,
      label: "Instagram",
      placeholder: "https://instagram.com/yourprofile",
    },
    {
      id: 3,
      label: "Twitter (X)",
      placeholder: "https://twitter.com/yourhandle",
    },
    {
      id: 4,
      label: "LinkedIn",
      placeholder: "https://linkedin.com/company/yourcompany",
    },
  ];

  return (
    <>
      <div className="mb-6 mx-10 mt-10 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
          Links
        </h1>
      </div>
      <div className="w-full text-black grid  gap-5 p-3 grid-cols-2  ">
        {tabs.map((tab, index) => {
          return (
            <div
              onClick={() => {
                setActiveTab(index);
              }}
              className={`   ${
                activeTab === index
                  ? " border-2 border-blueDark text-blueDark  "
                  : "text-black"
              }  flex justify-center border-2 border-transparent items-center p-4 rounded-lg gap-5 font-semibold cursor-pointer transition-all  `}
              key={index}
            >
              {tab}
            </div>
          );
        })}

        <Activity mode={activeTab === 1 ? "visible" : "hidden"}>
          <div className="col-span-2 p-4">
            <form>
              <LinksSection
                title="Social Media Links"
                links={socialLinks}
                onSave={handleSubmit}
                showEdit={showEdit}
                setShowEdit={setShowEdit}
              />
            </form>
          </div>
        </Activity>
        <Activity mode={activeTab === 0 ? "visible" : "hidden"}>
          <div className="col-span-2 p-4">
            <form onSubmit={handleSubmit}>
              <LinksSection
                title="Application Links"
                links={appLinks}
                onSave={handleSubmit}
                showEdit={showEdit}
                setShowEdit={setShowEdit}
              />
            </form>
          </div>
        </Activity>
      </div>
    </>
  );
}
