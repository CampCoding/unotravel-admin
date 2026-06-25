import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { img } from "../../utils/imageUrl.js";

export default function FileUpload({ label, value, onChange, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const currentPreview = preview || (value ? img(value) : null);
  const isVideo = accept?.includes("video");

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      {currentPreview && !isVideo && (
        <div className="mb-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-32 flex items-center justify-center">
          <img src={currentPreview} alt="preview" className="max-h-full max-w-full object-contain" />
        </div>
      )}
      {currentPreview && isVideo && (
        <div className="mb-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-24 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Icon icon="mdi:video-check" width={20} className="text-blueMain" />
          File selected
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blueMain/50 transition cursor-pointer bg-gray-50 flex flex-col items-center gap-1"
      >
        <Icon icon={isVideo ? "mdi:video-plus-outline" : "mdi:cloud-upload-outline"} className="text-gray-300" width={28} />
        <p className="text-xs text-gray-500">Click to {currentPreview ? "change" : "upload"}</p>
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}
