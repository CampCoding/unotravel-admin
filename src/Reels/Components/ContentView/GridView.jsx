import React from "react";

import Reels from "./Reel.jsx";

export default function GridView({ videos }) {
  return (
    <>
      <Reels videos={videos} />
    </>
  );
}
