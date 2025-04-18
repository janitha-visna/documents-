import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import NodeEdgeUI from '../pages/networkui/NodeEdgeUI';
import LandingPage from '../pages/homepage/LandingPage';



const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/network",
    element: <NodeEdgeUI />,
  },
]);

export default router;