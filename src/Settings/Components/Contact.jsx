import React, { useCallback, useState } from "react";
import SubHeader from "../../Shared/SubHeader/SubHeader.jsx";
import LinksSection from "./Links/LinksSection.jsx";
import { RichTextJodit } from "../../Shared/RichText/RichText.jsx";
import { Icon } from "@iconify/react";

export default function Contact() {
  const [showEdit, setShowEdit] = useState(false);
  const companyInputs = [
    {
      id: 1,
      label: "Company Name",
      value: "Uno Travel Sweden AB (Main Branch)",
    },
    {
      id: 2,
      label: "Location",
      value: "Arlanda Airport Sky City, Stockholm - Sweden",
    },
    { id: 3, label: "Telephone", value: "(0046) 850780055" },
    { id: 4, label: "Mobile Phone", value: "(0046) 0700097767" },
    { id: 5, label: "E-Post", value: "info@unotravel.se" },
    { id: 6, label: "Org Number", value: "559288-2707" },
    { id: 7, label: "Branch", value: "Uno Travel Sweden (City Branch)" },
    { id: 8, label: "Branch Location", value: "Vårberg centrum, Stockholm" },
  ];
  const handleSave = useCallback(() => {
    console.log("submit");
  }, []);
  return (
    <>
      <SubHeader label={"Contact"} />

      <div className="p-4 m-5">
        <form>
          <div className=" flex justify-end">
            {" "}
            <button
              type="button"
              onClick={() => setShowEdit(!showEdit)}
              className="text-gray-600 hover:text-blueMain transition"
              title="Edit"
            >
              <div className="flex gap-3 justify-between items-center">
                <span>Edit</span>
                <Icon icon="flowbite:edit-solid" className="w-6 h-6" />
              </div>
            </button>
          </div>
          <RichTextJodit dataLabel={"Post Address"} />
          <LinksSection
            title="Contact Details"
            links={companyInputs}
            onSave={handleSave}
            showEdit={showEdit}
            setShowEdit={setShowEdit}
            enableEdit={true}
          />
        </form>
      </div>
    </>
  );
}
