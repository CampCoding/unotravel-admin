import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { tourBookingsAPI } from "../../api/endpoints.js";

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const STATUS_STYLE = {
  pending:  "bg-amber-100 text-amber-700",
  paid:     "bg-green-100 text-green-700",
  failed:   "bg-red-100 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

function PaymentModal({ booking, onClose, onSaved }) {
  const [status, setStatus] = useState(booking.payment_status);
  const [reference, setReference] = useState(booking.payment_reference || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await tourBookingsAPI.updatePayment(booking.id, { payment_status: status, payment_reference: reference });
      onSaved();
      onClose();
    } catch { alert("Failed to update"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Update Payment</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Booking by <span className="font-semibold text-gray-700">{booking.full_name}</span></p>
            <p className="text-xs text-gray-500">Tour: <span className="font-semibold text-gray-700">{booking.tour_title || booking.tour_slug || "—"}</span></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Reference #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. TXN-123456"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose }) {
  const hasPickup = booking.meeting_option === "pickup" && booking.pickup_lat && booking.pickup_lng;
  const lat = Number(booking.pickup_lat);
  const lng = Number(booking.pickup_lng);
  const mapSrc = hasPickup
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Booking Details</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Tour info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-500 font-semibold uppercase mb-1">Tour</p>
            <p className="font-bold text-gray-800">{booking.tour_title || booking.tour_slug || "—"}</p>
            {booking.destination_slug && <p className="text-sm text-gray-500 capitalize">{booking.destination_slug}</p>}
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Full Name",  value: booking.full_name },
              { label: "Phone",      value: booking.phone },
              { label: "Email",      value: booking.email || "—" },
              { label: "Travelers",  value: booking.travelers },
              { label: "Date",       value: booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "—" },
              { label: "Meeting",    value: booking.meeting_option },
              { label: "Total",      value: `$${Number(booking.total_price).toFixed(2)}` },
              { label: "Payment",    value: booking.payment_status },
              { label: "Ref #",      value: booking.payment_reference || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Pickup map */}
          {hasPickup && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Icon icon="mdi:map-marker" width={16} className="text-purple-500" />
                Pickup Location
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={mapSrc}
                  width="100%" height="260"
                  style={{ border: 0 }}
                  title="Pickup location"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank" rel="noreferrer"
                  className="ml-2 text-blueMain underline"
                >Open in Google Maps</a>
              </p>
            </div>
          )}
          {booking.meeting_option === "pickup" && !hasPickup && (
            <div className="bg-amber-50 text-amber-700 text-xs rounded-xl px-4 py-3">
              Pickup selected but no coordinates were provided.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TourBookingsView() {
  const [filterStatus, setFilterStatus] = useState("");
  const [editBooking, setEditBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const { data: raw, loading, error, refetch } = useFetch(
    () => tourBookingsAPI.list(filterStatus ? { payment_status: filterStatus } : {}),
    [filterStatus]
  );
  const rows = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    await tourBookingsAPI.delete(id);
    refetch();
  };

  if (loading) return <div className="flex items-center justify-center h-48"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error) return <div className="text-red-500 text-sm p-4">Failed to load bookings.</div>;

  return (
    <>
      {editBooking && (
        <PaymentModal booking={editBooking} onClose={() => setEditBooking(null)} onSaved={refetch} />
      )}
      {viewBooking && (
        <BookingDetailModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
          {["", ...PAYMENT_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                filterStatus === s ? "bg-blueMain text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tour</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Travelers</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Meeting</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ref #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-12 text-center text-gray-400">No bookings yet.</td></tr>
              )}
              {rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{row.full_name}</p>
                    {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.phone}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-700 text-xs">{row.tour_title || row.tour_slug || "—"}</p>
                    {row.destination_slug && <p className="text-gray-400 text-xs capitalize">{row.destination_slug}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {row.booking_date ? new Date(row.booking_date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 font-semibold">{row.travelers}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${row.meeting_option === 'pickup' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {row.meeting_option}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-blueMain">${Number(row.total_price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLE[row.payment_status] || "bg-gray-100 text-gray-600"}`}>
                      {row.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.payment_reference || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewBooking(row)}
                        title="View details"
                        className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition"
                      >
                        <Icon icon="mdi:eye-outline" width={16} />
                      </button>
                      <button
                        onClick={() => setEditBooking(row)}
                        title="Update payment"
                        className="w-8 h-8 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition"
                      >
                        <Icon icon="mdi:credit-card-edit-outline" width={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                      >
                        <Icon icon="mdi:trash-can-outline" width={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Total: {rows.length} booking{rows.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </>
  );
}
