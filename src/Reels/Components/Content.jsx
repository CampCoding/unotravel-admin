import React from "react";
import TableView from "./ContentView/TableView.jsx";
import GridView from "./ContentView/GridView.jsx";

export default function Content({ view, data, onDelete, onEdit, onRefetch }) {
  const videos = (data || []).map((r) => ({
    ...r,
    id: r.reel_id || r.id,
    src: r.reel_video,
    thumbnail: r.reel_thumbnail || null,
    title: r.reel_title,
    active: r.reel_active,
  }));
  return view === "grid"
    ? <GridView videos={videos} onDelete={onDelete} onEdit={onEdit} />
    : <TableView videos={videos} onRefetch={onRefetch} onEdit={onEdit} />;
}
