import React from "react";
import { Link } from "react-router";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";

export default function Card() {
  const text =
    "Trustly online bank payments With Trustly's direct bank payment online, payments go directly from account to account - without a card, app download or registration requirement.";
  return (
    <>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-center rounded-lg items-center">
          <img src={service} className="shadow-sm w-full" alt="Service Icon" />
        </div>
        <h5 className="mb-2 text-lg font-medium tracking-tight text-black/80 ">
          Noteworthy technology acquisitions 2021
        </h5>
        <p className="text-black/60 text-[15px] font-normal">
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </p>

        <div className="flex justify-between items-center mt-5">
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blueMain/90 rounded-lg transition-all hover:bg-blueMain focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            View
          </button>
          <div className=" flex justify-center gap-4  items-center">
            <button className="bg-blueMain/90 p-2 rounded-md text-white hover:bg-white transition-all border border-transparent hover:border-blueMain hover:text-blueMain  ">
              <Icon icon="flowbite:edit-solid" />
            </button>
            <button className="bg-red-600 p-2 rounded-md text-white hover:bg-white transition-all border border-transparent hover:border-red-600 hover:text-red-600  ">
              <Icon icon="wpf:delete" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
