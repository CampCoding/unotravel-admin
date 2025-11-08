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
          title={"Add Banner"}
          icon={"gg:add"}
          setOpenDrawer={setOpenDrawer}
        />
        <Content openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      </div>
    </section>
  );
}
