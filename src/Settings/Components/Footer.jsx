import React, { useCallback, useState } from "react";
import SubHeader from "../../Shared/SubHeader/SubHeader.jsx";
import LinksSection from "./Links/LinksSection.jsx";
import { RichTextJodit } from "../../Shared/RichText/RichText.jsx";
import { Icon } from "@iconify/react";

export default function Contact() {
  const [showEdit, setShowEdit] = useState(false);
  const companyInputs = [
    {
      label: "copyright",
      value: "© 2023 Uno Travel Sweden AB. All rights reserved.",
    },
  ];
  const handleSave = useCallback(() => {
    console.log("submit");
  }, []);
  return (
    <>
      <SubHeader label={"Footer"} />

      <div className="p-4 m-5">
        <form>
          <div className="">
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
            <h1 className="text-2xl mb-5 font-semibold text-gray-800 tracking-wide">
              Big Bang Logo
            </h1>
            <div className="flex items-center  justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center ${
                  showEdit ? "cursor-pointer" : "cursor-not-allowed"
                }  justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg  bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 `}
              >
                <div className="flex flex-col  items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  disabled={!showEdit}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <LinksSection
            title="Footer Information"
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
