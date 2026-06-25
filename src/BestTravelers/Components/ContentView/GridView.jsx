import React from "react";
import Card from "./Card.jsx";

export default function GridView({ data, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-2">
      {(data || []).map((traveler) => (
        <Card key={traveler.traveler_id || traveler.id} traveler={traveler} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
