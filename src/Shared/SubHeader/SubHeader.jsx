import React from "react";

export default function SubHeader({ label }) {
  return (
    <>
      <div className="mb-6 mx-10 mt-10 border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
          {label}
        </h1>
      </div>
    </>
  );
}
