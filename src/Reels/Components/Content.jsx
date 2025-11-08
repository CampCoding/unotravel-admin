import React, { Activity } from "react";
import TableView from "./ContentView/TableView.jsx";
import GridView from "./ContentView/GridView.jsx";

export default function Content({ view }) {
  const viewType = { grid: "grid", table: "table" };
  const videos = [
    {
      id: 1,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747228720/habopum5zcpt4yn0uli1.mp4",
    },
    {
      id: 2,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747232329/mxix31l7drinrylwbliq.mp4",
    },
    {
      id: 3,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747232566/ekcbvdut8qhymtcogc4u.mp4",
    },
    {
      id: 4,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747232804/wwvxwk0hshhtcifauslx.mp4",
    },
    {
      id: 5,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747228720/habopum5zcpt4yn0uli1.mp4",
    },
    {
      id: 6,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747232329/mxix31l7drinrylwbliq.mp4",
    },
    {
      id: 7,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747232566/ekcbvdut8qhymtcogc4u.mp4",
    },
    {
      id: 8,
      src: "https://res.cloudinary.com/dbzn1y8rt/video/upload/v1747232804/wwvxwk0hshhtcifauslx.mp4",
    },
  ];

  return (
    <>
      <Activity mode={view === viewType.grid ? "visible" : "hidden"}>
        <GridView videos={videos} />
      </Activity>
      <Activity mode={view === viewType.table ? "visible" : "hidden"}>
        <TableView videos={videos} />
      </Activity>
    </>
  );
}
