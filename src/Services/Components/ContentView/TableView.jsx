import React, { useState, useRef, useEffect } from "react";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";

export default function TableView() {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRefs.current &&
        !dropdownRefs.current.some((ref) => ref?.contains(e.target))
      ) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              Service Image
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Service Name
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 5 }).map((_, index, arr) => {
            const isLast = index === arr.length - 1; // 🔹 آخر صف
            return (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {/* الصورة */}
                <td className="py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white">
                  <img
                    src={service}
                    className="w-10/12 h-12 object-contain mx-auto"
                    alt="Service icon"
                  />
                </td>

                {/* الاسم */}
                <td className="px-6 py-4 text-center">Uno Travel</td>

                {/* الأكشن */}
                <td className="px-6 py-4 text-center">
                  <div
                    className="relative inline-block text-left"
                    ref={(el) => (dropdownRefs.current[index] = el)}
                  >
                    {/* زر القائمة */}
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition"
                      type="button"
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 4 15"
                      >
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </button>

                    {/* القائمة */}
                    {openIndex === index && (
                      <div
                        className={`absolute right-0 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 dark:bg-gray-700 dark:divide-gray-600 animate-fade-in ${
                          isLast ? "bottom-full mb-2" : "mt-2"
                        }`}
                      >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          {/* Edit */}
                          <li>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => alert("Edit clicked")}
                              className="flex justify-between items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer group"
                            >
                              <span className="text-[16px] font-medium">
                                Edit
                              </span>
                              <div className="bg-blueMain/90 flex justify-start p-2 rounded-md text-white group-hover:bg-white transition-all border border-transparent group-hover:border-blueMain group-hover:text-blueMain">
                                <Icon icon="flowbite:edit-solid" />
                              </div>
                            </div>
                          </li>

                          {/* Delete */}
                          <li>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => alert("Delete clicked")}
                              className="flex justify-between items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer group"
                            >
                              <span className="text-[16px] font-medium">
                                Delete
                              </span>
                              <div className="bg-red-600 p-2 rounded-md text-white group-hover:bg-white transition-all border border-transparent group-hover:border-red-600 group-hover:text-red-600">
                                <Icon icon="wpf:delete" />
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
