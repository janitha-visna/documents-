// components/CustomNode.js
import React from "react";
import { Handle } from "@xyflow/react";

const CustomNode = ({ data }) => (
  <div
    style={{
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      background: "#83A0C4",
      position: "relative",
    }}
  >
    <Handle type="target" position="left" style={{ background: "blue" }} />
    {data.label}
    <Handle type="source" position="right" style={{ background: "green" }} />
  </div>
);

export default CustomNode;
