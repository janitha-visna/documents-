import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import Flow from '../pages/Flow';
import PdfPage from "../pages/PdfPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <FileUpload />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/flow",
    element: <Flow />,
  },
  {
    path:"/pdf",
    element:<PdfPage/>
  }
]);

export default router; 
