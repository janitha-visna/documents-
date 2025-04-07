// // hooks/useFlowAPI.js
// import { useState, useEffect } from "react";

// const useFlowAPI = () => {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   const saveToAPI = async (nodes, edges) => {
//     const payload = { nodes, edges };

//     try {
//       const response = await fetch("http://localhost:5000/api/save", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to save");
//       const data = await response.json();
//       console.log("Save successful:", data);
//     } catch (error) {
//       console.error("Save error:", error);
//     }
//   };

//   const fetchFlowData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/flow");
//       const data = await response.json();

//       if (data.success) {
//         const fetchedNodes = data.data.nodes.map((node) => ({
//           ...node,
//           position: { x: node.position_x, y: node.position_y },
//         }));
//         const fetchedEdges = data.data.edges;

//         setNodes(fetchedNodes);
//         setEdges(fetchedEdges);
//       }
//     } catch (error) {
//       console.error("Error fetching flow data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchFlowData();
//   }, []);

//   return { nodes, edges, setNodes, setEdges, saveToAPI };
// };

// export default useFlowAPI;
