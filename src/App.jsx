import { createBrowserRouter, Router, RouterProvider } from "react-router";
import "./App.css";
import Layout from "./assets/Layout/Layout.jsx";
import Banners from "./Banners/Index.jsx";
import Services from "./Services/Index.jsx";
import SalesAgents from "./salesAgents/index.jsx";
import News from "./News/Index.jsx";
import Reels from "./Reels/Index.jsx";
import Partners from "./Parteners/Index.jsx";
import Features from "./Features/Index.jsx";
import Contact from "./Contact/Index.jsx";
import AboutUs from "./About/Index.jsx";
import Settings from "./Settings/Index.jsx";

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
        path: "/reels",
        element: <Reels />,
      },
      {
        path: "/Partners",
        element: <Partners />,
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/AboutUs",
        element: <AboutUs />,
      },
      {
        path: "/settings",
        element: <Settings />,
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
