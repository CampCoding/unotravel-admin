import React from "react";
import Card from "./Card.jsx";

export default function GridView({ data, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:grid-cols-4 mt-2">
      {(data || []).map((service) => (
        <Card key={service.id || service.service_id} service={service} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
