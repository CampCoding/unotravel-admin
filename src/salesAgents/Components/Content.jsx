import React from "react";
import TableView from "./ContentView/TableView.jsx";
import GridView from "./ContentView/GridView.jsx";

export default function Content({ view, data, onDelete, onEdit }) {
  return view === "grid"
    ? <GridView data={data} onDelete={onDelete} onEdit={onEdit} />
    : <TableView data={data} onDelete={onDelete} onEdit={onEdit} />;
}
