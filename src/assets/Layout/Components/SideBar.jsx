import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import { useLocation } from "react-router";
import logo from "/src/assets/images/BusinessCardLogo-removebg-preview.png";
import { useAuth } from "../../../context/AuthContext.jsx";

const menuGroups = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/", icon: "mdi:view-dashboard-outline" },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Banners",   path: "/banners",  icon: "mdi:images" },
      { name: "Services",  path: "/services", icon: "material-symbols:linked-services" },
      { name: "Offers",    path: "/offers",   icon: "mdi:tag-multiple" },
      { name: "Reels",     path: "/reels",    icon: "bxs:videos" },
      { name: "Logos",     path: "/logos",    icon: "mdi:image-multiple-outline" },
      { name: "Articles",  path: "/news",     icon: "fluent:news-24-regular" },
      { name: "News Categories", path: "/news-categories", icon: "mdi:tag-text-outline" },
    ],
  },
  {
    label: "Home Sections",
    items: [
      { name: "Why Choose Us",  path: "/why-choose-us-items",   icon: "mdi:star-check-outline" },
      { name: "WCU Banners",    path: "/why-choose-us-banners", icon: "mdi:image-multiple" },
      { name: "Travel Support", path: "/travel-support",        icon: "mdi:lifebuoy" },
      { name: "Fare Flight",    path: "/fare-flight-features",  icon: "mdi:airplane-takeoff" },
      { name: "Minors Lounge",  path: "/minors-lounge",         icon: "mdi:baby-face-outline" },
      { name: "Best Travelers", path: "/best-travelers",        icon: "mdi:account-star-outline" },
      { name: "Page Sections",  path: "/page-sections",         icon: "mdi:page-layout-body" },
    ],
  },
  {
    label: "Tours",
    items: [
      { name: "Destinations",    path: "/tour-destinations", icon: "mdi:map-marker-path" },
      { name: "Tours",           path: "/tours",             icon: "mdi:map-search-outline" },
      { name: "Int'l Tours Page",path: "/intl-tours",        icon: "mdi:earth" },
    ],
  },
  {
    label: "Travel Services",
    items: [
      { name: "Umrah",            path: "/umrah",            icon: "mdi:kaaba" },
      { name: "Visa Services",    path: "/visa",             icon: "mdi:passport" },
      { name: "Car Reservation",  path: "/car-reservation",  icon: "mdi:car-key" },
    ],
  },
  {
    label: "Registrations",
    items: [
      { name: "Offer Registrations", path: "/offer-registrations", icon: "mdi:clipboard-list-outline" },
      { name: "Tour Bookings",       path: "/tour-bookings",       icon: "mdi:ticket-confirmation-outline" },
      { name: "Online Payments",     path: "/online-payments",     icon: "mdi:credit-card-outline" },
    ],
  },
  {
    label: "Site Config",
    items: [
      { name: "Sales Agents",    path: "/salesAgents",  icon: "ph:users-three-fill" },
      { name: "About",           path: "/about",        icon: "mdi:information-outline" },
      { name: "Contact Page",    path: "/contact-form", icon: "mdi:contacts" },
      { name: "Application",     path: "/application",  icon: "mdi:cellphone" },
      { name: "Newsletter",      path: "/newsletter",   icon: "mdi:email-newsletter" },
      { name: "Legal Documents", path: "/legal",        icon: "mdi:file-document-multiple-outline" },
    ],
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="fixed top-3 left-3 z-50 inline-flex items-center p-2 text-sm text-white bg-blueMain rounded-lg md:hidden shadow-lg hover:bg-blue-700 focus:outline-none transition"
      >
        <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} width={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transform transition-transform duration-300 ease-in-out
          bg-gradient-to-b from-[#1a3a5c] via-[#1e4976] to-[#1a3a5c]
          text-white shadow-2xl flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-center px-6 py-5 border-b border-white/10 bg-white/5 flex-shrink-0">
          <img src={logo} alt="UNO Travel" className="h-14 w-auto object-contain drop-shadow-md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <span className="block px-2 pb-1.5 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
                {group.label}
              </span>
              <ul className="space-y-0.5">
                {group.items.map(({ name, path, icon }) => {
                  const active = location.pathname === path;
                  return (
                    <li key={name}>
                      <Link
                        to={path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-[13px] transition-all duration-200 group ${
                          active
                            ? "bg-white text-[#1a3a5c] shadow-md"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all flex-shrink-0 ${
                          active ? "bg-blueMain/10 text-blueMain" : "text-white/60 group-hover:text-white"
                        }`}>
                          <Icon icon={icon} width={18} />
                        </span>
                        <span className="truncate">{name}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blueMain flex-shrink-0" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blueMain/30 flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:account" width={18} className="text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 leading-none truncate">{user?.full_name || user?.username || "Admin"}</p>
              <p className="text-xs text-white/40 mt-0.5">{user?.email || "UNO Travel"}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/50 hover:text-white flex items-center justify-center transition flex-shrink-0"
            >
              <Icon icon="mdi:logout" width={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
