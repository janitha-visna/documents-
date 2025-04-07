// components/CustomEdge.js
import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
  const { setEdges } = useReactFlow();
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${
              (sourceX + targetX) / 2
            }px,${(sourceY + targetY) / 2}px)`,
            pointerEvents: "all",
            fontSize: "12px",
            padding: "2px 6px",
            background: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => setEdges((es) => es.filter((e) => e.id !== id))}
        >
          ×
        </button>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
