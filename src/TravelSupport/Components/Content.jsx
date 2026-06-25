import React from "react";
import GridView from "./ContentView/GridView.jsx";
import TableView from "./ContentView/TableView.jsx";

export default function Content({ view, data, onDelete, onEdit }) {
  return view === "grid"
    ? <GridView data={data} onDelete={onDelete} onEdit={onEdit} />
    : <TableView data={data} onDelete={onDelete} onEdit={onEdit} />;
}
