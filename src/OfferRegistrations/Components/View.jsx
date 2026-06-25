import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFetch } from "../../hooks/useFetch.js";
import { offerRegistrationsAPI } from "../../api/endpoints.js";

const STATUS_COLORS = { pending: "bg-amber-100 text-amber-700", paid: "bg-green-100 text-green-700" };

export default function OfferRegistrationsView() {
  const [deleteId, setDeleteId] = useState(null);
  const { data: raw, loading, error, refetch } = useFetch(() => offerRegistrationsAPI.list(), []);
  const rows = raw?.data ?? [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    await offerRegistrationsAPI.delete(id);
    refetch();
  };

  if (loading) return <div className="flex items-center justify-center h-48"><Icon icon="mdi:loading" className="animate-spin text-blueMain" width={32} /></div>;
  if (error) return <div className="text-red-500 text-sm p-4">Failed to load registrations.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Offer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Notes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No registrations yet.</td></tr>
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
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{row.notes || "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                  >
                    <Icon icon="mdi:trash-can-outline" width={16} />
                  </button>
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
  );
}
