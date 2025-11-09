import React, { useState, useRef, useEffect } from "react";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";
import Table from "../../../Shared/Table/Table.jsx";

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
