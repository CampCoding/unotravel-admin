import React, { Activity, useState } from "react";
import { Icon } from "@iconify/react";

export default function LinksSection({
  title,
  links,
  onSave,
  showEdit,
  setShowEdit,
  enableEdit = false,
}) {
  const disabled = !showEdit;

  return (
    <div className="mb-12">
      {/* ====== Header ====== */}
      <div className="mb-6 mt-10 border-b border-gray-200 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
          {title}
        </h1>

        <Activity mode={enableEdit ? "hidden" : "visible"}>
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
        </Activity>
      </div>

      {/* ====== Inputs ====== */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {links.map((link) => (
          <div key={link.label}>
            <label
              htmlFor={link.label}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {link.label}
            </label>
            <input
              type="text"
              id={link.label}
              disabled={disabled}
              defaultValue={link.value}
              placeholder={link.placeholder}
              className={`${
                disabled ? "opacity-70 cursor-not-allowed" : ""
              } bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none text-sm rounded-lg focus:ring-blueMain focus:border-blueMain block w-full p-2.5 `}
            />
          </div>
        ))}
      </div>

      {/* ====== Buttons ====== */}
      {showEdit && (
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => {
              setShowEdit(false);
              onSave();
            }}
            className="text-blueMain border border-blueMain hover:bg-blueMain hover:text-white focus:ring-0 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setShowEdit(false)}
            className="text-gray-500 border border-gray-500 hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
