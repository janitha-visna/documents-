// // hooks/useNodeEdgeInteractions.js
// import { useCallback, useRef } from "react";
// import { useStoreApi, useReactFlow } from "@xyflow/react";

// const MIN_DISTANCE = 150;

// const useNodeEdgeInteractions = (setEdges) => {
//   const store = useStoreApi();
//   const { getInternalNode } = useReactFlow();
//   const edgeReconnectSuccessful = useRef(true);

//   const getClosestEdge = useCallback(
//     (node) => {
//       const { nodeLookup } = store.getState();
//       const internalNode = getInternalNode(node.id);

//       const closestNode = Array.from(nodeLookup.values()).reduce(
//         (res, n) => {
//           if (n.id === internalNode.id) return res;
//           const dx =
//             n.internals.positionAbsolute.x -
//             internalNode.internals.positionAbsolute.x;
//           const dy =
//             n.internals.positionAbsolute.y -
//             internalNode.internals.positionAbsolute.y;
//           const d = Math.sqrt(dx * dx + dy * dy);
//           return d < res.distance && d < MIN_DISTANCE
//             ? { distance: d, node: n }
//             : res;
//         },
//         { distance: Number.MAX_VALUE, node: null }
//       );

//       if (!closestNode.node) return null;

//       const closeNodeIsSource =
//         closestNode.node.internals.positionAbsolute.x <
//         internalNode.internals.positionAbsolute.x;
//       return {
//         id: `${closestNode.node.id}-${node.id}-temp`,
//         source: closeNodeIsSource ? closestNode.node.id : node.id,
//         target: closeNodeIsSource ? node.id : closestNode.node.id,
//         type: "straight",
//         className: "temp",
//         style: { strokeDasharray: "5,5" },
//       };
//     },
//     [store, getInternalNode]
//   );

//   const onNodeDrag = useCallback(
//     (_, node) => {
//       const closeEdge = getClosestEdge(node);
//       setEdges((es) => {
//         const nextEdges = es.filter((e) => e.className !== "temp");
//         if (
//           closeEdge &&
//           !nextEdges.find(
//             (ne) =>
//               ne.source === closeEdge.source && ne.target === closeEdge.target
//           )
//         ) {
//           nextEdges.push(closeEdge);
//         }
//         return nextEdges;
//       });
//     },
//     [getClosestEdge, setEdges]
//   );

//   const onNodeDragStop = useCallback(
//     (_, node) => {
//       const closeEdge = getClosestEdge(node);
//       setEdges((es) => {
//         const nextEdges = es.filter((e) => e.className !== "temp");
//         if (closeEdge)
//           nextEdges.push({
//             ...closeEdge,
//             id: `${closeEdge.source}-${closeEdge.target}`,
//             className: undefined,
//           });
//         return nextEdges;
//       });
//     },
//     [getClosestEdge]
//   );

//   const onConnect = useCallback(
//     (params) =>
//       setEdges((eds) =>
//         addEdge({ ...params, type: "straight", animated: true }, eds)
//       ),
//     [setEdges]
//   );

//   const onReconnectStart = useCallback(() => {
//     edgeReconnectSuccessful.current = false;
//   }, []);

//   const onReconnect = useCallback((oldEdge, newConnection) => {
//     edgeReconnectSuccessful.current = true;
//     setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
//   }, []);

//   const onReconnectEnd = useCallback((_, edge) => {
//     if (!edgeReconnectSuccessful.current) {
//       setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//     }
//     edgeReconnectSuccessful.current = true;
//   }, []);

//   const onEdgesDelete = useCallback((edgesToDelete) => {
//     setEdges((eds) => eds.filter((edge) => !edgesToDelete.includes(edge)));
//   }, []);

//   return {
//     onNodeDrag,
//     onNodeDragStop,
//     onConnect,
//     onReconnectStart,
//     onReconnect,
//     onReconnectEnd,
//     onEdgesDelete,
//   };
// };

// export default useNodeEdgeInteractions;
