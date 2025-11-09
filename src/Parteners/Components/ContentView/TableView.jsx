import React, { useState, useRef, useEffect } from "react";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";
import Table from "../../../Shared/Table/Table.jsx";

export default function TableView() {
  return (
    <Table
      head={["Service Img", "Service Name"]}
      data={[
        {
          ServiceImg: service,
          ServiceName: "Service Name",
          price: "Price",
        },
        {
          id: 2,
          serviceimg: service,
          servicename: "Service Name",
          price: "Price",
        },
      ]}
    />
  );
}
