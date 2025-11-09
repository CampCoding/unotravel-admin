import React from "react";
import { Link } from "react-router";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";

export default function Card() {
  return (
    <>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-center rounded-lg items-center">
          <img src={service} className="shadow-sm w-full" alt="Service Icon" />
        </div>

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
