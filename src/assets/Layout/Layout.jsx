import React, { useState } from "react";
import Sidebar from "./Components/SideBar.jsx";
import { Outlet } from "react-router";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-Cairo">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
