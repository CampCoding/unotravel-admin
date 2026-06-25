import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

export default function RichText({ label, value, onChange, dir = "ltr" }) {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    toolbar: true,
    spellcheck: false,
    language: dir === "rtl" ? "ar" : "en",
    direction: dir,
    toolbarButtonSize: "small",
    buttons: [
      "bold", "italic", "underline", "|",
      "ul", "ol", "|",
      "font", "fontsize", "brush", "|",
      "align", "|",
      "link", "|",
      "undo", "redo",
    ],
    height: 220,
    minHeight: 150,
    removeButtons: ["image", "video", "file", "speechRecognize", "copyformat", "eraser", "print", "about", "fullsize"],
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    style: {
      font: "14px/1.6 inherit",
      direction: dir,
    },
    editorCssClass: dir === "rtl" ? "jodit-rtl" : "",
    disablePlugins: ["search", "xpath", "limit"],
  }), [dir]);

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="rounded-xl overflow-hidden border border-gray-200 focus-within:border-blueMain focus-within:ring-2 focus-within:ring-blueMain/20 transition">
        <JoditEditor
          ref={editor}
          value={value || ""}
          config={config}
          onBlur={(newContent) => onChange(newContent)}
        />
      </div>
    </div>
  );
}
