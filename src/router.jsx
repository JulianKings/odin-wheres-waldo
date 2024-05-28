import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainContent from "./mainContent";
import ErrorPage from "./components/errorPage";
import CreateStage from "./components/createStage";

const Router = () => {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <MainContent />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/create",
        element: <CreateStage />,
        errorElement: <ErrorPage />,
      },
    ]);
  
    return <RouterProvider router={router} />;
  };
  
  export default Router;