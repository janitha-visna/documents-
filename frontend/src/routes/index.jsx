import { createBrowserRouter } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import Flow from "../pages/Flow";

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
]);

export default router; 
