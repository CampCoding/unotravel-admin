import React from "react";
import Card from "./Card.jsx";

export default function GridView({ data, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
      {(data || []).map((offer) => (
        <Card key={offer.offer_id || offer.id} offer={offer} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
