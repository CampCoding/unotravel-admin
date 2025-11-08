import React, { useState } from "react";
import AddButton from "../../../Shared/AddButton/AddButton.jsx";
import Content from "./Content.jsx";

export default function View() {
  const [openDrawer, setOpenDrawer] = useState(false);
  console.log(openDrawer);

  return (
    <section className="">
      <div className="container mx-auto p-2">
        <AddButton
          title={"Add News"}
          icon={"gg:add"}
          setOpenDrawer={setOpenDrawer}
        />
        <div className="mt-4">
          {" "}
          <Content openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        </div>
      </div>
    </section>
  );
}
