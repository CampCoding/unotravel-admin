import React, { useState } from "react";

import Sidebar from "./Components/SideBar.jsx";
import { Outlet } from "react-router";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={` md:ml-64 
          `}
      >
        <Outlet />
      </div>
    </>
  );
}
