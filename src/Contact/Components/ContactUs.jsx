import React from "react";
import {RichTextJoditWithImage} from "../../Shared/RichText/RichText.jsx";
import banner from "/src/assets/images/banner.jpg";

export default function ContactUs() {
  return (
    <>
      <div className="mb-6 mx-10 mt-10 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
          Contact Us
        </h1>
      </div>
      <RichTextJoditWithImage
        data={banner}
        imageLabel="Contact Us Image"
        dataLabel="Contact Us Text"
      />
    </>
  );
}
