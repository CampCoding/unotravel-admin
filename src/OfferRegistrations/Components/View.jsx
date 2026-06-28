import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { offerRegistrationsAPI } from "../../api/endpoints.js";

const STATUSES = ["pending", "paid", "failed", "refunded"];
const STATUS_STYLE = {
  pending:  "bg-amber-100 text-amber-700",
  paid:     "bg-green-100 text-green-700",
  failed:   "bg-red-100 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

function PaymentModal({ reg, onClose, onSaved }) {
  const [status,    setStatus]    = useState(reg.payment_status ?? "pending");
  const [paymentId, setPaymentId] = useState(reg.payment_id || "");
  const [saving,    setSaving]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await offerRegistrationsAPI.updatePayment(reg.id, { payment_status: status, payment_id: paymentId });
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
          {reg.offer_name && <p className="text-xs text-gray-500">Offer: <span className="font-semibold text-gray-700">{reg.offer_name}</span></p>}
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

function DetailModal({ reg, onClose }) {
  const fmt = (d) => d ? new Date(d).toLocaleString("en-US", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
  const fields = [
    { l: "Full Name",   v: reg.full_name },
    { l: "Phone",       v: reg.phone },
    { l: "Email",       v: reg.email || "—" },
    { l: "Offer",       v: reg.offer_name || "—" },
    { l: "Payment",     v: reg.payment_status ?? "pending" },
    { l: "Payment ID",  v: reg.payment_id || "—" },
    { l: "Notes",       v: reg.notes || "—" },
    { l: "Submitted",   v: fmt(reg.created_at) },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Registration #{reg.id}</h3>
            <p className="text-xs text-gray-400">{fmt(reg.created_at)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <Icon icon="mdi:close" width={16} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          {fields.map(({ l, v }) => (
            <div key={l} className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">{l}</p>
              <p className="text-sm font-semibold text-gray-800 break-all">{v}</p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button onClick={onClose} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function OfferRegistrationsView() {
  const [filterStatus, setFilterStatus] = useState("");
  const [editReg, setEditReg] = useState(null);
  const [viewReg, setViewReg] = useState(null);
  const { data: raw, loading, error, refetch } = useFetch(
    () => offerRegistrationsAPI.list(filterStatus ? { payment_status: filterStatus } : {}),
    [filterStatus]
  );
  const rows = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    await offerRegistrationsAPI.delete(id);
    refetch();
  };

  if (loading) return <div className="flex items-center justify-center h-48"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error) return <div className="text-red-500 text-sm p-4">Failed to load registrations.</div>;

  return (
    <>
      {editReg && <PaymentModal reg={editReg} onClose={() => setEditReg(null)} onSaved={refetch} />}
      {viewReg && <DetailModal reg={viewReg} onClose={() => setViewReg(null)} />}

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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Full Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Offer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Notes</th>
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
                  <td className="px-4 py-3 font-medium text-gray-800">{row.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{row.email || "—"}</td>
                  <td className="px-4 py-3">
                    {row.offer_name
                      ? <span className="bg-blueMain/10 text-blueMain text-xs font-semibold px-2 py-1 rounded-full">{row.offer_name}</span>
                      : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLE[row.payment_status] ?? "bg-gray-100 text-gray-600"}`}>
                      {row.payment_status ?? "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.payment_id || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate text-xs">{row.notes || "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewReg(row)} title="View details"
                        className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition">
                        <Icon icon="mdi:eye-outline" width={16} />
                      </button>
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
