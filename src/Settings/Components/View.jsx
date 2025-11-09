import { useState } from "react";
import SiteDetails from "./SiteDetails.jsx";
import Policy from "./Policy.jsx";
import Links from "./Links.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";

export default function View() {
  const tabs = ["Site Details", "Policy", "Links", "Contact", "Footer"];
  const [activeTab, setActiveTab] = useState(4);

  return (
    <>
      <div className="">
        <div className="w-full bg-gradient-to-r from-[#3986c0]  to-[#9DCEF2]  py-6 rounded-b-md  ">
          <div className=" lg:ms-10 mx-3 flex justify-start items-center gap-2">
            {tabs.map((tab, index) => {
              return (
                <span
                  onClick={() => {
                    setActiveTab(index);
                  }}
                  className={`text-white font-semibold cursor-pointer transition-all border-2 border-transparent px-4 py-1 rounded-lg ${
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
        <div className="">{activeTab === 0 && <SiteDetails />}</div>
        <div className="">{activeTab === 1 && <Policy />}</div>
        <div className="">{activeTab === 2 && <Links />}</div>
        <div className="">{activeTab === 3 && <Contact />}</div>
        <div className="">{activeTab === 4 && <Footer />}</div>

        <div className=""></div>
      </div>
    </>
  );
}
