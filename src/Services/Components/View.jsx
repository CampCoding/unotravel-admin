import React, { useState } from "react";
import AddButton from "../../Shared/AddButton/AddButton.jsx";
import { Icon } from "@iconify/react";
import Content from "./Content.jsx";

export default function View() {
  const [view, setView] = useState("grid"); //
  return (
    <section className="">
      <div className="container mx-auto p-2">
        <div className="my-3">
          <AddButton title={"Add Service"} icon={"carbon:add-alt"} />
        </div>
        <div className="flex justify-end my-1">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`px-3 py-2 flex items-center  text-sm transition ${
                view === "grid"
                  ? "bg-blueMain text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon icon="mdi:view-grid" width={18} />
            </button>
            <button
              onClick={() => setView("table")}
              aria-label="Table view"
              className={`px-3 py-2 flex items-center gap-2 text-sm transition ${
                view === "table"
                  ? "bg-blueMain text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon icon="mdi:table" width={18} />
            </button>
          </div>
        </div>

        <Content view={view} />
      </div>
    </section>
  );
}
