import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import NodeEdgeUI from '../pages/networkui/NodeEdgeUI';



const router = createBrowserRouter([
 
  {
    path: "/",
    element: <NodeEdgeUI />,
  },
  
]);

export default router; 
