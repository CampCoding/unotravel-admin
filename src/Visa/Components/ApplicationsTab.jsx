import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { visaAPI } from "../../api/endpoints.js";

const STATUS_COLORS = {
  pending:   "bg-yellow-50 text-yellow-600",
  reviewing: "bg-blue-50  text-blue-600",
  approved:  "bg-green-50 text-green-600",
  rejected:  "bg-red-50   text-red-600",
};

const STATUS_LIST = ["pending","reviewing","approved","rejected"];

function DetailModal({ item, onClose, onUpdated }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes]   = useState(item.admin_notes || "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await visaAPI.applicationStatus(item.id, { status, admin_notes: notes });
      onUpdated();
      onClose();
    } catch { alert("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Application #{item.id}</h3>
            <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Icon icon="mdi:close" width={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Personal */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Personal Info</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Gender</span><br /><span className="font-medium capitalize">{item.gender}</span></div>
              <div><span className="text-gray-400">Age</span><br /><span className="font-medium">{item.age ?? "—"}</span></div>
              <div><span className="text-gray-400">First Name</span><br /><span className="font-medium">{item.first_name}</span></div>
              <div><span className="text-gray-400">Surname</span><br /><span className="font-medium">{item.surname}</span></div>
            </div>
          </section>

          {/* Visa Details */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Visa Details</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Nationality</span><br /><span className="font-medium">{item.nationality_flag} {item.nationality_name ?? "—"}</span></div>
              <div><span className="text-gray-400">Visa Type</span><br /><span className="font-medium">{item.visa_type_name ?? "—"}</span></div>
              <div><span className="text-gray-400">Passport Type</span><br /><span className="font-medium">{item.passport_type_name ?? "—"}</span></div>
              <div><span className="text-gray-400">Passport Expiry</span><br /><span className="font-medium">{item.passport_expiry ?? "—"}</span></div>
              <div><span className="text-gray-400">Issuing Country</span><br /><span className="font-medium">{item.issuing_country_name ?? "—"}</span></div>
              <div><span className="text-gray-400">Residence Country</span><br /><span className="font-medium">{item.residence_country_name ?? "—"}</span></div>
            </div>
          </section>

          {/* Status update */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Status Management</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {STATUS_LIST.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition capitalize ${
                    status === s ? "border-blueMain bg-blueMain text-white" : "border-gray-200 text-gray-500 hover:border-blueMain/50"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Admin notes (visible internally)…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blueMain/30 resize-none" />
          </section>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Close</button>
            <button onClick={handleUpdate} disabled={saving}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? "Saving…" : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsTab() {
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [viewItem, setViewItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await visaAPI.applicationsList(filterStatus ? { status: filterStatus } : {});
      setApps(res.data?.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await visaAPI.applicationDelete(id); load();
  };

  return (
    <>
      {viewItem && <DetailModal item={viewItem} onClose={() => setViewItem(null)} onUpdated={load} />}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {["", ...STATUS_LIST].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${
              filterStatus === s ? "bg-blueMain text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Nationality</th>
                <th className="px-4 py-3 text-left">Visa Type</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {apps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{app.id}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{app.first_name} {app.surname}</td>
                  <td className="px-4 py-2.5 text-gray-600">{app.nationality_flag} {app.nationality_name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600">{app.visa_type_name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-500"}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setViewItem(app)} className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition" title="View">
                        <Icon icon="mdi:eye-outline" width={13} />
                      </button>
                      <button onClick={() => handleDelete(app.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                        <Icon icon="mdi:trash-can-outline" width={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {apps.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No applications found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
