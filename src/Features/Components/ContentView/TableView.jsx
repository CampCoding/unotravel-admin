import React, { useState, useRef, useEffect } from "react";
import service from "/src/assets/images/BusinessCardLogo.webp";
import { Icon } from "@iconify/react";
import Table from "../../../Shared/Table/Table.jsx";
import { useMemo } from "react";

export default function TableView() {
  const data =useMemo(() => [
    {
      id: 1,
      featureimg: service,
      featurename: "Quick Delivery",
      description: "We deliver your order within 24 hours",
    },
    {
      id: 2,
      featureimg: service,
      featurename: "Best Quality",
      description: "High-quality services at affordable prices",
    },
    {
      id: 3,
      featureimg: service,
      featurename: "Customer Support",
      description: "24/7 support for all your questions",
    },
  ],[]);
  return (
    <Table head={["Feature Img", "Feature Name", "Description"]} data={data} />
  );
}
