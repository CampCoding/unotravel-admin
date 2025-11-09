import React from "react";
import { RichTextJodit } from "../../Shared/RichText/RichText.jsx";

export default function Policy() {
  const servicesList = [
    { id: 1, title: "Privacy Policy", slug: "privacy-policy" },
    { id: 2, title: "Terms and Conditions", slug: "terms-and-conditions" },
    { id: 3, title: "Terms of Services", slug: "terms-of-services" },
    { id: 4, title: "Terms of Use", slug: "terms-of-use" },
  ];

  return (
    <>
      <div className="mb-6 mx-10 mt-10 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
          Policy
        </h1>
      </div>
      {servicesList.map((service, index) => {
        return (
          <div key={service.id}>
         
            <RichTextJodit dataLabel={service.title} />
          </div>
        );
      })}
    </>
  );
}
