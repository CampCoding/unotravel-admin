import { useState } from "react";
import Massages from "./Massages.jsx";
import LeaveMassage from "./LeaveMassage.jsx";
import ContactUs from "./ContactUs.jsx";

export default function View() {
  const tabs = ["Contact", "Leave Message", "Massages"];
  const [activeTab, setActiveTab] = useState(0);
  console.log(activeTab);

  return (
    <>
      <div className="">
        <div className="w-full bg-gradient-to-r from-[#3986c0]  to-[#9DCEF2]  py-6 rounded-b-sm  ">
          <div className=" ms-10 flex justify-start items-center gap-2">
            {tabs.map((tab, index) => {
              return (
                <span
                  onClick={() => {
                    setActiveTab(index);
                  }}
                  className={`text-white font-semibold cursor-pointer border-2 border-transparent transition-all px-4 py-1 rounded-lg ${
                    activeTab === index ? "border-2 border-white" : ""
                  }`}
                  key={index}
                >
                  {tab}
                </span>
              );
            })}
          </div>
        </div>
        <div className="">{activeTab === 0 && <ContactUs />}</div>
        <div className="">{activeTab === 1 && <LeaveMassage />}</div>
        <div className="">{activeTab === 2 && <Massages />}</div>
      </div>
    </>
  );
}
