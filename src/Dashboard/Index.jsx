import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import banner from "/src/assets/images/Banner.jpg";
import {
  bannersAPI, servicesAPI, agentsAPI, newsAPI, reelsAPI,
  offersAPI, logosAPI, newsCategoriesAPI, whyChooseUsItemsAPI,
  travelSupportAPI, fareFlightFeaturesAPI, minorsLoungeAPI,
  bestTravelersAPI, pageSectionsAPI,
} from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";

const quickLinks = [
  { label: "Banners", path: "/banners", icon: "mdi:images", desc: "Manage promotional banners" },
  { label: "Services", path: "/services", icon: "material-symbols:linked-services", desc: "Manage travel services" },
  { label: "Offers", path: "/offers", icon: "mdi:tag-multiple", desc: "Manage special offers" },
  { label: "Sales Agents", path: "/salesAgents", icon: "ph:users-three-fill", desc: "Manage your team" },
  { label: "News", path: "/news", icon: "fluent:news-24-regular", desc: "Publish news & articles" },
  { label: "Reels", path: "/reels", icon: "bxs:videos", desc: "Manage video reels" },
  { label: "Why Choose Us", path: "/why-choose-us-items", icon: "mdi:star-check-outline", desc: "Feature highlights" },
  { label: "Best Travelers", path: "/best-travelers", icon: "mdi:account-star-outline", desc: "Featured travelers" },
  { label: "About", path: "/about", icon: "mdi:information-outline", desc: "About section content" },
  { label: "Newsletter", path: "/newsletter", icon: "mdi:email-newsletter", desc: "Newsletter settings" },
];

const statDefs = [
  { key: "banners", label: "Banners", icon: "mdi:images", light: "bg-blue-50", text: "text-blue-500", path: "/banners", api: bannersAPI.list },
  { key: "services", label: "Services", icon: "material-symbols:linked-services", light: "bg-indigo-50", text: "text-indigo-500", path: "/services", api: servicesAPI.list },
  { key: "offers", label: "Offers", icon: "mdi:tag-multiple", light: "bg-amber-50", text: "text-amber-500", path: "/offers", api: offersAPI.list },
  { key: "agents", label: "Sales Agents", icon: "ph:users-three-fill", light: "bg-emerald-50", text: "text-emerald-500", path: "/salesAgents", api: agentsAPI.list },
  { key: "news", label: "Articles", icon: "fluent:news-24-regular", light: "bg-rose-50", text: "text-rose-500", path: "/news", api: newsAPI.list },
  { key: "reels", label: "Reels", icon: "bxs:videos", light: "bg-purple-50", text: "text-purple-500", path: "/reels", api: reelsAPI.list },
  { key: "logos", label: "Logos", icon: "mdi:image-multiple-outline", light: "bg-cyan-50", text: "text-cyan-500", path: "/logos", api: logosAPI.list },
  { key: "categories", label: "Categories", icon: "mdi:tag-text-outline", light: "bg-orange-50", text: "text-orange-500", path: "/news-categories", api: newsCategoriesAPI.list },
  { key: "travelers", label: "Best Travelers", icon: "mdi:account-star-outline", light: "bg-teal-50", text: "text-teal-500", path: "/best-travelers", api: bestTravelersAPI.list },
  { key: "whyItems", label: "Why Choose Us", icon: "mdi:star-check-outline", light: "bg-lime-50", text: "text-lime-600", path: "/why-choose-us-items", api: whyChooseUsItemsAPI.list },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState(() => Object.fromEntries(statDefs.map((s) => [s.key, "—"])));

  useEffect(() => {
    Promise.allSettled(statDefs.map((s) => s.api())).then((results) => {
      const next = {};
      results.forEach((res, i) => {
        const key = statDefs[i].key;
        if (res.status === "fulfilled") {
          const d = res.value.data?.data;
          next[key] = Array.isArray(d) ? d.length : (typeof d === "number" ? d : "—");
        } else {
          next[key] = "—";
        }
      });
      setCounts(next);
    });
  }, []);

  return (
    <div className="flex-1 p-6 space-y-8">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm">
        <img src={banner} alt="" className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a5c]/90 via-[#1a3a5c]/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold text-white">{user?.full_name || user?.username || "Admin"}</h1>
          <p className="text-white/60 text-sm mt-1">UNO Travel — Content Management System</p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
          <Icon icon="mdi:calendar-check-outline" className="text-white/70" width={18} />
          <span className="text-white text-sm font-medium">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statDefs.map((stat) => (
            <Link
              key={stat.key}
              to={stat.path}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-10 h-10 ${stat.light} ${stat.text} rounded-xl flex items-center justify-center mb-3`}>
                <Icon icon={stat.icon} width={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{counts[stat.key]}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blueMain/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blueMain/10 text-blueMain rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blueMain group-hover:text-white transition-all duration-300">
                <Icon icon={link.icon} width={22} />
              </div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blueMain transition-colors">{link.label}</p>
              <p className="text-xs text-gray-400 mt-1 leading-snug">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
