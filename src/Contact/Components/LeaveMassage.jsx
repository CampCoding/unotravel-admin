import React from "react";
import {RichTextJoditWithImage} from "../../Shared/RichText/RichText.jsx";

export default function LeaveMassage() {
  return (
    <>
      <div className="mb-6 mx-10 mt-10 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
          Leave a Massage
        </h1>
      </div>
      <RichTextJoditWithImage imageLabel="leave a Massage Image  " dataLabel="Leave a Massage Text" />
    </>
  );
}
