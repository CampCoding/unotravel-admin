import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import Toggle from "../../Shared/Form/Toggle.jsx";
import LangTabs from "../../Shared/Form/LangTabs.jsx";
import RichText from "../../Shared/Form/RichText.jsx";
import { toursAPI, tourDestinationsAPI } from "../../api/endpoints.js";

const inp = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition";
const LANGS = [{ id: 1 }, { id: 2 }];

const initTranslations = (existing) =>
  LANGS.map(({ id }) => {
    const t = existing?.find((x) => x.language_id === id);
    return {
      language_id: id,
      tour_title: t?.tour_title || "",
      overview_html: t?.overview_html || "",
      faq_whats_included: t?.faq_whats_included || "",
      faq_departure_point: t?.faq_departure_point || "",
      faq_what_to_expect: t?.faq_what_to_expect || "",
      faq_additional_info: t?.faq_additional_info || "",
      faq_cancellation_policy: t?.faq_cancellation_policy || "",
    };
  });

// ── Media Manager (edit mode only) ──────────────────────────────────────────
function MediaManager({ tourId, initialMedia = [] }) {
  const [mediaList, setMediaList] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const fileRef = useRef(null);

  const refresh = () => {
    toursAPI.getById(tourId).then((res) => {
      const tour = res.data?.data;
      if (tour?.media) setMediaList(Array.isArray(tour.media) ? tour.media : []);
    });
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("tour_media_file", file);
      fd.append("media_type", "image");
      fd.append("is_main", mediaList.length === 0 ? "1" : "0");
      await toursAPI.addMedia(tourId, fd);
      refresh();
    } catch { alert("Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("media_url", urlInput.trim());
      fd.append("media_type", mediaType);
      fd.append("is_main", mediaList.length === 0 ? "1" : "0");
      await toursAPI.addMedia(tourId, fd);
      setUrlInput("");
      refresh();
    } catch { alert("Failed to add URL"); }
    finally { setUploading(false); }
  };

  const handleSetMain = async (mediaId) => {
    try {
      await toursAPI.setMainMedia(tourId, mediaId);
      setMediaList((prev) => prev.map((m) => ({ ...m, is_main: m.media_id === mediaId ? 1 : 0 })));
    } catch { alert("Failed"); }
  };

  const handleDelete = async (mediaId) => {
    if (!window.confirm("Delete this media?")) return;
    try {
      await toursAPI.deleteMedia(tourId, mediaId);
      setMediaList((prev) => prev.filter((m) => m.media_id !== mediaId));
    } catch { alert("Delete failed"); }
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tour Media</p>

      {/* Current media grid */}
      {mediaList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {mediaList.map((m) => (
            <div key={m.media_id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {m.media_type === "video" ? (
                <video src={m.media_url} className="w-full h-[110px] object-cover" muted />
              ) : (
                <img src={m.media_url} alt="" className="w-full h-[110px] object-cover" />
              )}

              {/* Main badge */}
              {m.is_main ? (
                <span className="absolute top-1.5 left-1.5 bg-blueMain text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Main
                </span>
              ) : null}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                {!m.is_main && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(m.media_id)}
                    title="Set as main"
                    className="bg-blueMain text-white rounded-lg p-1.5 hover:bg-blue-700 transition"
                  >
                    <Icon icon="mdi:star" width={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(m.media_id)}
                  title="Delete"
                  className="bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600 transition"
                >
                  <Icon icon="mdi:trash-can-outline" width={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mediaList.length === 0 && (
        <p className="text-sm text-gray-400 italic mb-4">No media yet. Add images or videos below.</p>
      )}

      {/* Upload file */}
      <div className="flex items-center gap-2 mb-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blueMain rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {uploading ? <Icon icon="mdi:loading" className="animate-spin" width={16} /> : <Icon icon="mdi:upload" width={16} />}
          Upload Image / Video
        </button>
      </div>

      {/* Add by URL */}
      <div className="flex gap-2">
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 transition w-[100px]"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste URL..."
          className={inp + " flex-1"}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
        />
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={uploading || !urlInput.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ── Main Form ────────────────────────────────────────────────────────────────
export default function TourForm({ initialData, onSuccess, onClose }) {
  const isEdit = !!initialData;
  const id = initialData?.tour_id || initialData?.id;

  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState(initialData?.destination_id ?? "");
  const [tourSlug, setTourSlug] = useState(initialData?.tour_slug ?? "");
  const [basePrice, setBasePrice] = useState(initialData?.base_price ?? 0);
  const [pickupExtraPrice, setPickupExtraPrice] = useState(initialData?.pickup_extra_price ?? 50);
  const [maxTravelers, setMaxTravelers] = useState(initialData?.max_travelers ?? 15);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [active, setActive] = useState(initialData?.tour_active ?? true);
  const [meetingAddress, setMeetingAddress] = useState(initialData?.meeting_point_address ?? "");
  const [meetingLat, setMeetingLat] = useState(initialData?.meeting_point_lat ?? "");
  const [meetingLng, setMeetingLng] = useState(initialData?.meeting_point_lng ?? "");
  const [pickupAddress, setPickupAddress] = useState(initialData?.pickup_point_address ?? "");
  const [pickupLat, setPickupLat] = useState(initialData?.pickup_point_lat ?? "");
  const [pickupLng, setPickupLng] = useState(initialData?.pickup_point_lng ?? "");
  const [translations, setTranslations] = useState(initTranslations(initialData?.translations));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    tourDestinationsAPI.list()
      .then((res) => setDestinations(res.data?.data ?? []))
      .catch(() => setDestinations([]));
  }, []);

  const getDestName = (dest) =>
    dest?.translations?.find((t) => t.language_id === 1)?.city_name ||
    dest?.translations?.[0]?.city_name ||
    dest?.destination_slug || `#${dest?.destination_id}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        destination_id: destinationId,
        tour_slug: tourSlug,
        base_price: basePrice,
        pickup_extra_price: pickupExtraPrice,
        max_travelers: maxTravelers,
        sort_order: sortOrder,
        tour_active: active ? "1" : "0",
        meeting_point_address: meetingAddress || null,
        meeting_point_lat: meetingLat || null,
        meeting_point_lng: meetingLng || null,
        pickup_point_address: pickupAddress || null,
        pickup_point_lat: pickupLat || null,
        pickup_point_lng: pickupLng || null,
        translations: JSON.stringify(translations),
      };
      if (isEdit) await toursAPI.update(id, payload);
      else await toursAPI.create(payload);
      onSuccess();
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination</label>
        <select
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          className={inp}
          required
        >
          <option value="">Select destination...</option>
          {destinations.map((d) => (
            <option key={d.destination_id} value={d.destination_id}>
              {getDestName(d)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tour Slug</label>
        <input
          type="text"
          value={tourSlug}
          onChange={(e) => setTourSlug(e.target.value)}
          className={inp}
          placeholder="e.g. barcelona-city-tour"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Price ($)</label>
          <input type="number" step="0.01" min="0" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pickup Extra Price ($)</label>
          <input type="number" step="0.01" min="0" value={pickupExtraPrice} onChange={(e) => setPickupExtraPrice(e.target.value)} className={inp} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Travelers</label>
          <input type="number" min="1" value={maxTravelers} onChange={(e) => setMaxTravelers(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inp} />
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl px-4 py-1">
        <Toggle label="Active" value={active} onChange={setActive} />
      </div>

      {/* Location Settings */}
      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Icon icon="mdi:map-marker" width={14} /> Meeting Point
        </p>
        <input type="text" value={meetingAddress} onChange={e => setMeetingAddress(e.target.value)} placeholder="Address / description" className={inp} />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" step="any" value={meetingLat} onChange={e => setMeetingLat(e.target.value)} placeholder="Latitude (e.g. 41.4036)" className={inp} />
          <input type="number" step="any" value={meetingLng} onChange={e => setMeetingLng(e.target.value)} placeholder="Longitude (e.g. 2.1744)" className={inp} />
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 pt-2">
          <Icon icon="mdi:map-marker-radius" width={14} /> Pickup Point
        </p>
        <input type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} placeholder="Address / description" className={inp} />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" step="any" value={pickupLat} onChange={e => setPickupLat(e.target.value)} placeholder="Latitude" className={inp} />
          <input type="number" step="any" value={pickupLng} onChange={e => setPickupLng(e.target.value)} placeholder="Longitude" className={inp} />
        </div>
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <Icon icon="mdi:information-outline" width={12} />
          Tip: right-click on Google Maps → "What's here?" to get coordinates
        </p>
      </div>

      {/* Media Manager — edit mode only */}
      {isEdit && (
        <MediaManager
          tourId={id}
          initialMedia={Array.isArray(initialData?.media) ? initialData.media : []}
        />
      )}

      {!isEdit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          <Icon icon="mdi:information-outline" className="inline mr-1.5" width={16} />
          Save the tour first, then you can upload images & videos.
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Translations</p>
        <LangTabs
          values={translations}
          onChange={setTranslations}
          renderFields={(t, update, lang) => {
            const ar = lang?.id === 2;
            return (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{ar ? "عنوان الجولة" : "Tour Title"}</label>
                  <input type="text" value={t.tour_title || ""} onChange={(e) => update("tour_title", e.target.value)} className={inp} />
                </div>
                <RichText
                  label={ar ? "نظرة عامة" : "Overview (HTML)"}
                  value={t.overview_html || ""}
                  onChange={(val) => update("overview_html", val)}
                  dir={ar ? "rtl" : "ltr"}
                />
                <RichText
                  label={ar ? "ما المشمول" : "What's Included"}
                  value={t.faq_whats_included || ""}
                  onChange={(val) => update("faq_whats_included", val)}
                  dir={ar ? "rtl" : "ltr"}
                />
                <RichText
                  label={ar ? "نقطة الانطلاق" : "Departure Point"}
                  value={t.faq_departure_point || ""}
                  onChange={(val) => update("faq_departure_point", val)}
                  dir={ar ? "rtl" : "ltr"}
                />
                <RichText
                  label={ar ? "ماذا تتوقع" : "What to Expect"}
                  value={t.faq_what_to_expect || ""}
                  onChange={(val) => update("faq_what_to_expect", val)}
                  dir={ar ? "rtl" : "ltr"}
                />
                <RichText
                  label={ar ? "معلومات إضافية" : "Additional Info"}
                  value={t.faq_additional_info || ""}
                  onChange={(val) => update("faq_additional_info", val)}
                  dir={ar ? "rtl" : "ltr"}
                />
                <RichText
                  label={ar ? "سياسة الإلغاء" : "Cancellation Policy"}
                  value={t.faq_cancellation_policy || ""}
                  onChange={(val) => update("faq_cancellation_policy", val)}
                  dir={ar ? "rtl" : "ltr"}
                />
              </div>
            );
          }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blueMain rounded-xl hover:bg-blue-700 shadow-md shadow-blueMain/20 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <Icon icon="mdi:loading" className="animate-spin" width={16} />}
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
