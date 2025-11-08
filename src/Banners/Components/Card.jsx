import React from "react";
import banner from "/src/assets/images/Banner.jpg";
import { Icon } from "@iconify/react";

export default function Card() {
  return (
    <>
      <div className=" flex justify-center items-center">
        <div className="max-w-sm my-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg" src={banner} alt="logo" />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
            <div className="flex justify-between items-center">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blueMain/90 rounded-lg transition-all hover:bg-blueMain focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                View
              </button>
              <div className=" flex justify-center gap-4 items-center">
                <button className="bg-blueMain/90 p-2 rounded-md text-white hover:bg-white transition-all border border-transparent hover:border-blueMain hover:text-blueMain  ">
                  <Icon icon="flowbite:edit-solid" />
                </button>
                <button className="bg-red-600 p-2 rounded-md text-white hover:bg-white transition-all border border-transparent hover:border-red-600 hover:text-red-600  ">
                  <Icon icon="wpf:delete" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
