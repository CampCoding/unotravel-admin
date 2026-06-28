import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

// Module-level cache — fetched once per session
let _cachedIcons = null;
let _fetchPromise = null;

function fetchIcons() {
  if (_cachedIcons) return Promise.resolve(_cachedIcons);
  if (_fetchPromise) return _fetchPromise;
  const base = import.meta.env.VITE_API_URL || "https://api.unotravelsweden.com";
  _fetchPromise = fetch(`${base}/icons`)
    .then(r => r.json())
    .then(data => { _cachedIcons = Array.isArray(data) ? data : []; return _cachedIcons; })
    .catch(() => { _cachedIcons = []; return []; });
  return _fetchPromise;
}

function iconifyId(kebab) { return `lucide:${kebab}`; }

/**
 * IconPicker
 *
 * Props:
 *   value    — stored value (depends on format)
 *   onChange — callback(value: string)
 *   format   — "pascal"  → value is "ShieldCheck"      (default, used for lucide-react)
 *              "iconify" → value is "lucide:shield-check" (used with @iconify/react)
 */
export default function IconPicker({ value, onChange, format = "pascal" }) {
  const [icons, setIcons]     = useState(_cachedIcons ?? []);
  const [loading, setLoading] = useState(!_cachedIcons);
  const [search, setSearch]   = useState("");
  const searchRef             = useRef(null);

  useEffect(() => {
    if (_cachedIcons) { setIcons(_cachedIcons); setLoading(false); return; }
    setLoading(true);
    fetchIcons().then(list => { setIcons(list); setLoading(false); });
  }, []);

  // Resolve which icon object is currently selected
  const selectedIcon = icons.find(ic =>
    format === "iconify"
      ? iconifyId(ic.kebab) === value
      : ic.pascal === value
  );

  // What value to emit when user clicks an icon
  const emitValue = (ic) =>
    format === "iconify" ? iconifyId(ic.kebab) : ic.pascal;

  // What iconify string to display for a given stored value
  const displayIconify = (ic) => iconifyId(ic.kebab);

  const filtered = search.trim()
    ? icons.filter(ic =>
        ic.pascal.toLowerCase().includes(search.toLowerCase()) ||
        ic.kebab.includes(search.toLowerCase())
      )
    : icons;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Search bar */}
      <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-100 bg-gray-50">
        <Icon icon="mdi:magnify" className="text-gray-400 flex-shrink-0" width={16} />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${icons.length} icons…`}
          className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        {search && (
          <button type="button" onClick={() => { setSearch(""); searchRef.current?.focus(); }} className="text-gray-400 hover:text-gray-600">
            <Icon icon="mdi:close" width={14} />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="max-h-52 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-400 text-xs">
            <Icon icon="mdi:loading" className="animate-spin" width={18} /> Loading icons…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">No icons found for "{search}"</div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
            {filtered.slice(0, 240).map(ic => {
              const selected = selectedIcon?.pascal === ic.pascal;
              return (
                <button
                  key={ic.pascal}
                  type="button"
                  onClick={() => onChange(emitValue(ic))}
                  title={ic.pascal}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all text-center ${
                    selected
                      ? "bg-blueMain text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon icon={displayIconify(ic)} width={18} />
                  <span className="text-[8px] leading-tight truncate w-full">{ic.pascal}</span>
                </button>
              );
            })}
            {filtered.length > 240 && (
              <div className="col-span-6 sm:col-span-8 text-center py-2 text-xs text-gray-400">
                +{filtered.length - 240} more — refine your search
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected footer */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 flex items-center gap-2 min-h-[36px]">
        {selectedIcon ? (
          <>
            <Icon icon={displayIconify(selectedIcon)} width={16} className="text-blueMain flex-shrink-0" />
            <span className="text-xs text-gray-700 font-medium">{selectedIcon.pascal}</span>
            <span className="text-xs text-gray-400 font-mono">({iconifyId(selectedIcon.kebab)})</span>
            <button type="button" onClick={() => onChange("")} className="ml-auto text-xs text-red-400 hover:text-red-600 transition">
              Clear
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400">No icon selected</span>
        )}
      </div>
    </div>
  );
}
