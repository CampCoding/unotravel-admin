import React, { Activity } from "react";
import Card from "../Card.jsx";
import Drawer from "../../../Shared/Drawer/Drawer.jsx";

export default function Content({ openDrawer, setOpenDrawer }) {
  const handleClose = () => setOpenDrawer(false);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="w-full flex justify-center">
            <Card key={index} />
          </div>
        ))}

        <Drawer openDrawer={openDrawer} onClose={handleClose} />
      </div>
    </>
  );
}
