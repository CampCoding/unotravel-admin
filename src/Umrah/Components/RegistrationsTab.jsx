import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { umrahAPI } from "../../api/endpoints.js";

const STATUSES = ["pending", "paid", "failed", "refunded"];
const STATUS_STYLE = {
  pending:  "bg-amber-100 text-amber-700",
  paid:     "bg-green-100 text-green-700",
  failed:   "bg-red-100 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

function PaymentModal({ reg, onClose, onSaved }) {
  const [status,    setStatus]    = useState(reg.payment_status);
  const [paymentId, setPaymentId] = useState(reg.payment_id || "");
  const [saving,    setSaving]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await umrahAPI.updatePayment(reg.id, { payment_status: status, payment_id: paymentId });
      onSaved();
      onClose();
    } catch { alert("Failed to update"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Update Payment</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-xs text-gray-500">Registration by <span className="font-semibold text-gray-700">{reg.full_name}</span></p>
          {reg.package_title && <p className="text-xs text-gray-500">Package: <span className="font-semibold text-gray-700">{reg.package_title}</span></p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition">
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment ID / Reference</label>
            <input type="text" value={paymentId} onChange={e => setPaymentId(e.target.value)} placeholder="e.g. TXN-123456"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationsTab() {
  const [filterStatus, setFilterStatus] = useState("");
  const [editReg, setEditReg] = useState(null);
  const { data: raw, loading, error, refetch } = useFetch(
    () => umrahAPI.registrationsList(filterStatus ? { payment_status: filterStatus } : {}),
    [filterStatus]
  );
  const rows = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    await umrahAPI.registrationDelete(id);
    refetch();
  };

  if (loading) return <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error) return <div className="text-red-500 p-4">Failed to load registrations.</div>;

  return (
    <>
      {editReg && <PaymentModal reg={editReg} onClose={() => setEditReg(null)} onSaved={refetch} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
          {["", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${filterStatus === s ? "bg-blueMain text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Package</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Travelers</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">No registrations yet.</td></tr>
              )}
              {rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{row.full_name}</p>
                    {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
                    {row.passport_number && <p className="text-xs text-gray-400">Passport: {row.passport_number}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{row.package_title || "—"}</td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-700">{row.travelers}</td>
                  <td className="px-4 py-3 font-bold text-blueMain">${Number(row.total_price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLE[row.payment_status] || "bg-gray-100 text-gray-600"}`}>
                      {row.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.payment_id || "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setEditReg(row)} title="Update payment"
                        className="w-8 h-8 rounded-lg bg-blueMain/10 hover:bg-blueMain/20 text-blueMain flex items-center justify-center transition">
                        <Icon icon="mdi:credit-card-edit-outline" width={16} />
                      </button>
                      <button onClick={() => handleDelete(row.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
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
            Total: {rows.length} registration{rows.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </>
  );
}
