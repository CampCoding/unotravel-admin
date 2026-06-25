import React from "react";
import Card from "./Card.jsx";

export default function GridView({ data, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-2">
      {(data || []).map((logo) => (
        <Card key={logo.logo_id || logo.id} logo={logo} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
