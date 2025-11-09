import React, { useState, useRef, useEffect, lazy } from "react";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";

const Table = lazy(() => import("../../../Shared/Table/Table.jsx"));
export default function TableView() {
  return (
    <Table
      head={["Service Img", "Service Name"]}
      data={[
        { serviceimg: service, servicename: "Service Name", price: "Price" },
        { serviceimg: service, servicename: "Service Name", price: "Price" },
      ]}
    />
  );
}
