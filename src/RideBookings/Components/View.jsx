import React, { useState } from "react";
import { rideBookingsAPI } from "../../api/endpoints";
import { Icon } from "@iconify/react";

const STATUS_OPTIONS = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
const STATUS_COLORS  = { pending:"bg-amber-100 text-amber-700", confirmed:"bg-blue-100 text-blue-700", in_progress:"bg-purple-100 text-purple-700", completed:"bg-green-100 text-green-700", cancelled:"bg-red-100 text-red-700" };

function DetailModal({ row, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Ride Booking #{row.id}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"><Icon icon="mdi:close" /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Full Name</p><p className="font-bold text-gray-800">{row.full_name}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Phone</p><p className="font-bold text-gray-800">{row.dial_code} {row.phone}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Email</p><p className="font-bold text-gray-800">{row.email || "—"}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Status</p><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[row.status] || "bg-gray-100 text-gray-600"}`}>{row.status}</span></div>
            <div className="col-span-2"><p className="text-xs text-gray-400 font-semibold mb-0.5">From</p><p className="text-gray-700">{row.from_location || "—"}</p></div>
            <div className="col-span-2"><p className="text-xs text-gray-400 font-semibold mb-0.5">To</p><p className="text-gray-700">{row.to_location || "—"}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Ride Date</p><p className="text-gray-700">{row.ride_date ? new Date(row.ride_date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "—"}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Car</p><p className="text-gray-700">{row.car_model || "—"} {row.car_category ? `(${row.car_category})` : ""}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Passengers</p><p className="text-gray-700">{row.passengers} adults{row.children > 0 ? `, ${row.children} children` : ""}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Bags</p><p className="text-gray-700">{row.bags}</p></div>
            {row.name_on_sign && <div className="col-span-2"><p className="text-xs text-gray-400 font-semibold mb-0.5">Name on Sign</p><p className="text-gray-700">{row.name_on_sign}</p></div>}
            {row.flight_details && <div className="col-span-2"><p className="text-xs text-gray-400 font-semibold mb-0.5">Flight / Notes</p><p className="text-gray-700">{row.flight_details}</p></div>}
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Car Price</p><p className="text-gray-700">{row.car_price} {row.currency}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Pickup Fee</p><p className="text-gray-700">{row.pickup_fee} {row.currency}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Tax</p><p className="text-gray-700">{row.tax} {row.currency}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Total</p><p className="font-black text-[#264787]">{row.total_price} {row.currency}</p></div>
            {row.route_distance_km && <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Distance</p><p className="text-gray-700">{row.route_distance_km} km</p></div>}
            <div><p className="text-xs text-gray-400 font-semibold mb-0.5">Booked On</p><p className="text-gray-700">{new Date(row.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p></div>
          </div>
          {row.admin_notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs text-amber-700 font-bold mb-1">Admin Notes</p>
              <p className="text-xs text-amber-800">{row.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RideBookingsView({ bookings, onRefresh }) {
  const [viewRow,    setViewRow]    = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [notesMap,   setNotesMap]   = useState({});
  const [error,      setError]      = useState("");

  const updateStatus = async (id, status) => {
    setUpdatingId(id); setError("");
    try {
      await rideBookingsAPI.updateStatus(id, { status, admin_notes: notesMap[id] ?? undefined });
      onRefresh();
    } catch { setError("Failed to update status."); }
    finally { setUpdatingId(null); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try { await rideBookingsAPI.delete(id); onRefresh(); }
    catch { setError("Failed to delete booking."); }
  };

  if (!bookings.length) return <div className="py-16 text-center text-gray-400 text-sm">No ride bookings yet.</div>;

  return (
    <>
      {viewRow && <DetailModal row={viewRow} onClose={() => setViewRow(null)} />}
      {error && <div className="mb-3 text-xs text-red-600 bg-red-50 rounded-xl p-3">{error}</div>}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Route</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Car</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map(row => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">#{row.id}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-800 text-xs">{row.full_name}</p>
                  <p className="text-gray-400 text-[11px]">{row.dial_code} {row.phone}</p>
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  <p className="text-[11px] text-gray-600 truncate" title={row.from_location}>{row.from_location || "—"}</p>
                  <p className="text-[11px] text-gray-400 truncate" title={row.to_location}>→ {row.to_location || "—"}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{row.car_model || "—"}</td>
                <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{row.ride_date ? new Date(row.ride_date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "—"}</td>
                <td className="px-4 py-3 text-xs font-black text-[#264787] whitespace-nowrap">{row.total_price} {row.currency}</td>
                <td className="px-4 py-3">
                  <select value={row.status || "pending"}
                    onChange={e => updateStatus(row.id, e.target.value)}
                    disabled={updatingId === row.id}
                    className={`text-xs font-bold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[row.status] || "bg-gray-100 text-gray-600"}`}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setViewRow(row)} title="View details"
                      className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition">
                      <Icon icon="mdi:eye-outline" width={14} />
                    </button>
                    <button onClick={() => deleteBooking(row.id)} title="Delete"
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                      <Icon icon="mdi:trash-can-outline" width={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
