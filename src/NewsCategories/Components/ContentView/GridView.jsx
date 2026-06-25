import React from "react";
import Card from "./Card.jsx";

export default function GridView({ data, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-2">
      {(data || []).map((cat) => (
        <Card key={cat.category_id || cat.id} category={cat} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
