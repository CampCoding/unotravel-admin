import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { carReservationAPI } from "../../api/endpoints.js";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"];
const STATUS_STYLE = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-700",
};
const CAT_STYLE = { ECONOMY: "bg-emerald-100 text-emerald-700", SEDAN: "bg-blue-100 text-blue-700", PREMIUM: "bg-amber-100 text-amber-700" };

function StatusModal({ booking, onClose, onSaved }) {
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes]   = useState(booking.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await carReservationAPI.bookingStatus(booking.id, { status, notes });
      onSaved(); onClose();
    } catch { alert("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Update Status</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><Icon icon="mdi:close" width={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Booking by <span className="font-semibold text-gray-800">{booking.full_name}</span></p>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30">
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ booking, onClose }) {
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Booking #{booking.id}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><Icon icon="mdi:close" width={16} /></button>
        </div>
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Car */}
          {booking.car_image_url && (
            <div className="relative h-40 rounded-xl overflow-hidden">
              <img src={booking.car_image_url} alt={booking.car_model} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-bold">{booking.car_model}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_STYLE[booking.car_category] ?? "bg-gray-100 text-gray-600"}`}>{booking.car_category}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Full Name",    v: booking.full_name },
              { l: "Phone",        v: `${booking.dial_code || ""}${booking.phone}` },
              { l: "Email",        v: booking.email || "—" },
              { l: "Start Date",   v: fmtDate(booking.start_date) },
              { l: "End Date",     v: fmtDate(booking.end_date) },
              { l: "Total Days",   v: `${booking.total_days} day${booking.total_days !== 1 ? "s" : ""}` },
              { l: "Passengers",   v: `${booking.passengers} adult${booking.passengers > 1 ? "s" : ""}${booking.children > 0 ? ` + ${booking.children} child` : ""}` },
              { l: "Bags",         v: booking.bags },
              { l: "Rental Price", v: `${Number(booking.rental_price).toFixed(2)} ${booking.currency}` },
              { l: "Pickup Fee",   v: `${Number(booking.pickup_fee).toFixed(2)} ${booking.currency}` },
              { l: "Tax (15%)",    v: `${Number(booking.tax).toFixed(2)} ${booking.currency}` },
              { l: "Total",        v: `${Number(booking.total_price).toFixed(2)} ${booking.currency}` },
            ].map(({ l, v }) => (
              <div key={l} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">{l}</p>
                <p className="text-sm font-semibold text-gray-800">{v}</p>
              </div>
            ))}
          </div>

          {booking.pickup_location && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">{booking.pickup_location}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">{booking.dropoff_location || "—"}</p>
              </div>
              {booking.route_distance_km && (
                <p className="text-xs text-gray-400">Route: {booking.route_distance_km} km · ~{booking.route_duration_min} min</p>
              )}
            </div>
          )}

          {booking.notes && (
            <div className="bg-amber-50 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-600 font-semibold mb-0.5">Notes</p>
              <p className="text-sm text-amber-800">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingsTab() {
  const [filterStatus, setFilterStatus] = useState("");
  const [editBooking,  setEditBooking]  = useState(null);
  const [viewBooking,  setViewBooking]  = useState(null);

  const { data: raw, loading, error, refetch } = useFetch(
    () => carReservationAPI.bookingsList(filterStatus ? { status: filterStatus } : {}),
    [filterStatus]
  );
  const rows = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    await carReservationAPI.bookingDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error)   return <div className="text-red-500 p-4">Failed to load bookings.</div>;

  return (
    <>
      {editBooking && <StatusModal booking={editBooking} onClose={() => setEditBooking(null)} onSaved={refetch} />}
      {viewBooking && <DetailModal booking={viewBooking} onClose={() => setViewBooking(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
          {["", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterStatus === s ? "bg-blueMain text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{rows.length} booking{rows.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["#","Name","Phone","Car","Dates","Days","Total","Status","Created","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 && <tr><td colSpan={10} className="py-12 text-center text-gray-400">No bookings yet.</td></tr>}
              {rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 whitespace-nowrap">{row.full_name}</p>
                    {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.dial_code}{row.phone}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-700 text-xs whitespace-nowrap">{row.car_model || "—"}</p>
                    {row.car_category && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CAT_STYLE[row.car_category] ?? "bg-gray-100 text-gray-500"}`}>{row.car_category}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {row.start_date ? new Date(row.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                    {row.end_date && <> → {new Date(row.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</>}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 font-semibold">{row.total_days}</td>
                  <td className="px-4 py-3 font-bold text-blueMain whitespace-nowrap">{Number(row.total_price).toFixed(2)} {row.currency}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLE[row.status] ?? "bg-gray-100 text-gray-600"}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewBooking(row)} title="View" className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition">
                        <Icon icon="mdi:eye-outline" width={16} />
                      </button>
                      <button onClick={() => setEditBooking(row)} title="Update status" className="w-8 h-8 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                        <Icon icon="mdi:pencil-outline" width={16} />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                        <Icon icon="mdi:trash-can-outline" width={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
