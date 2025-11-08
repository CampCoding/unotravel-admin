import React from "react";
import { Icon } from "@iconify/react";

export default function AddButton({ title, icon, setOpenDrawer }) {
  return (
    <>
      <div className="flex justify-end ">
        <button
          onClick={() => setOpenDrawer(true)}
          className="p-3 bg-blueMain rounded-md text-white font-medium flex items-center gap-1"
        >
          <Icon icon={`${icon}`} />
          <span>{title || "Add"}</span>
        </button>
      </div>
    </>
  );
}
