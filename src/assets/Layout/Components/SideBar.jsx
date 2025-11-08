import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useLocation } from "react-router";
import logo from "/src/assets/images/BusinessCardLogo-removebg-preview.png";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: "Banners", path: "/banners", icon: "mdi:images" },
    {
      name: "Services",
      path: "/services",
      icon: "material-symbols:linked-services",
    },
    { name: "Sales Agents", path: "/salesAgents", icon: "ph:users-three-fill" },
    { name: "News", path: "/news", icon: "fluent:news-24-regular" },
    { name: "Reals", path: "/reals", icon: "bxs:videos" },
  ];

  return (
    <>
      {/* زرار الفتح والإغلاق */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition"
      >
        <Icon icon="mdi:menu" width={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transform transition-transform duration-300 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center justify-start gap-3 px-5 py-4 border-b border-white/10">
            <img
              src={logo}
              alt="UNO Travel"
              className="w-full object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map(({ name, path, icon }) => {
                const active = location.pathname === path;
                return (
                  <li key={name}>
                    <Link
                      to={path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-200 ${
                        active
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-white/85 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <Icon icon={icon} width={22} />
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 mt-auto border-t border-white/10 text-sm text-white/70">
            <p>© 2025 UNO Travel</p>
          </div>
        </div>
      </aside>

      {/* Overlay على الموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
