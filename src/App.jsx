import { createBrowserRouter, Router, RouterProvider } from "react-router";
import "./App.css";
import Layout from "./assets/Layout/Layout.jsx";
import Banners from "./Banners/Index.jsx";
import Services from "./Services/Index.jsx";
import SalesAgents from "./salesAgents/index.jsx";
import News from "./News/Index.jsx";
import Reels from "./Reels/Index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Banners />,
      },
      {
        path: "/banners",
        element: <Banners />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/salesAgents",
        element: <SalesAgents />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/reals",
        element: <Reels />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
