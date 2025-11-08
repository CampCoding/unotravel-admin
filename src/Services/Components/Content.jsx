import React, { Activity } from "react";
import View from "./View.jsx";
import TableView from "./ContentView/TableView.jsx";
import GridView from "./ContentView/GridView.jsx";

export default function Content({ view }) {
  const viewType = { grid: "grid", table: "table" };

  return (
    <>
      <Activity mode={view === viewType.grid ? "visible" : "hidden"}>
        <GridView />
      </Activity>
      <Activity mode={view === viewType.table ? "visible" : "hidden"}>
        <TableView />
      </Activity>
    </>
  );
}
