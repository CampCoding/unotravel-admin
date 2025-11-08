import React from "react";
import banner from "/src/assets/images/Banner.jpg";
import { Icon } from "@iconify/react";

export default function Card() {
  return (
    <>
      <div className="max-w-xs bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        {/* الصورة */}
        <div className="relative">
          <img
            src={banner}
            alt="Bali Trip"
            className="w-full h-48 object-cover"
          />

          {/* التاج */}
          <span className="absolute top-3 left-3 bg-blueMain text-white text-xs font-medium px-3 py-1 rounded-md shadow-sm">
            Blog
          </span>
        </div>

        {/* المحتوى */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-blueMain mb-1">
            The All-In-One Bali Trip
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Introducing the: Pioneering the Future of Automotive Innovation. A
            Groundbreaking Marvel.{" "}
            <a href="#" className="text-blueMain font-medium hover:underline">
              Read More
            </a>
          </p>
          <div className="flex justify-between items-center mt-5">
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
    </>
  );
}
