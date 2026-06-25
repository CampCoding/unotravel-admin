import React from "react";
import Card from "./Card.jsx";

export default function GridView({ data, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-2">
      {(data || []).map((feature) => (
        <Card key={feature.feature_id || feature.id} feature={feature} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
