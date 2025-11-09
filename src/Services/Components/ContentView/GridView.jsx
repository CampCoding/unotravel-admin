import React from "react";
import Card from "./Card.jsx";

export default function GridView() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:grid-cols-4 mt-2">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="w-full flex justify-center" >
            <Card />
          </div>
        ))}
      </div>
    </>
  );
}
