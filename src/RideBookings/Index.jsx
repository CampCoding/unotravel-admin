import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { rideBookingsAPI } from "../api/endpoints";
import RideBookingsView from "./Components/View";

const STATUS_OPTIONS = ["all", "pending", "confirmed", "in_progress", "completed", "cancelled"];

export default function RideBookings() {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => {
    setLoading(true); setError("");
    const params = statusFilter !== "all" ? { status: statusFilter } : {};
    rideBookingsAPI.list(params)
      .then(res => { setBookings(res?.data?.data?.data ?? []); setLoading(false); })
      .catch(() => { setError("Failed to load ride bookings."); setLoading(false); });
  };

  useEffect(() => { load(); }, [statusFilter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Ride Bookings</h1>
          <p className="text-sm text-gray-400 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#264787]/20 focus:border-[#264787] transition">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1).replace("_"," ")}</option>)}
          </select>
          <button onClick={load} className="w-9 h-9 rounded-xl border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 transition">
            <Icon icon="mdi:refresh" width={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500 text-sm">{error}</div>
      ) : (
        <RideBookingsView bookings={bookings} onRefresh={load} />
      )}
    </div>
  );
}
