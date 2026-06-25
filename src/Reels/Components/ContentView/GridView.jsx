import React from "react";
import Reels from "./Reel.jsx";

export default function GridView({ videos, onDelete, onEdit }) {
  return <Reels videos={videos} onDelete={onDelete} onEdit={onEdit} />;
}
