import JoditEditor from "jodit-react";
import React, { useRef, useState } from "react";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";

export const RichTextJoditWithImage = ({
  data,
  imageLabel = "Image",
  dataLabel = "Editor",
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write something...",
    toolbarAdaptive: false,
    toolbarSticky: false,
    style: {
      background: "white",
      color: "#1F2937",
      fontSize: "15px",
    },
  };

  const handleEdit = () => alert("Edit image clicked!");
  const handleDelete = () => alert("Delete image clicked!");

  return (
    <div className="m-10">
      {/* ===== Image Section ===== */}
      <div className="relative w-full flex flex-col items-center  justify-center mb-6 group">
        <div className="w-full relative flex justify-center">
          <span className="place-self-start text-gray-600 bg-white px-2 py-1 rounded-md absolute top-3 left-[9%]">
            {imageLabel}
          </span>
          {/* الصورة */}
          <img
            src={data || service}
            alt="Service"
            className=" w-10/12 h-56 rounded-lg shadow-md"
          />
        </div>

        {/* أزرار فوق الصورة */}
        <div className="absolute top-3 right-3 flex gap-2   transition-opacity duration-300">
          {/* Edit */}
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center justify-center shadow-md transition"
            title="Edit Image"
          >
            <Icon icon="flowbite:edit-solid" className="w-5 h-5" />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center shadow-md transition"
            title="Delete Image"
          >
            <Icon icon="wpf:delete" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="w-full h-[2px] bg-black/50 "></div>

      {/* ===== Jodit Editor ===== */}
      <div className="">
        <div className="mb-6  mt-10 border-b border-gray-200 pb-2 ">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
            {dataLabel}
          </h1>
        </div>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      {/* ===== Preview Section ===== */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Preview:</h2>
        <div
          className="p-4 bg-gray-50 border rounded-md"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};
export const RichTextJodit = ({ data, dataLabel }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write something...",
    toolbarAdaptive: false,
    toolbarSticky: false,
    style: {
      background: "white",
      color: "#1F2937",
      fontSize: "15px",
    },
  };

  const handleEdit = () => alert("Edit image clicked!");
  const handleDelete = () => alert("Delete image clicked!");

  return (
    <div className="m-10">
      {/* ===== Image Section ===== */}

      {/* ===== Jodit Editor ===== */}
      <div className="">
        {" "}
        <div className="mb-6   mt-10 border-b border-gray-200 pb-2 ">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
            {dataLabel}
          </h1>
        </div>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      {/* ===== Preview Section ===== */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Preview:</h2>
        <div
          className="p-4 bg-gray-50 border rounded-md"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};
