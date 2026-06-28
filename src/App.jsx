import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./Shared/ProtectedRoute.jsx";
import Layout from "./assets/Layout/Layout.jsx";
import Login from "./Login/Index.jsx";
import Dashboard from "./Dashboard/Index.jsx";
import Banners from "./Banners/Index.jsx";
import Services from "./Services/Index.jsx";
import SalesAgents from "./salesAgents/index.jsx";
import News from "./News/Index.jsx";
import Reels from "./Reels/Index.jsx";
import Offers from "./Offers/Index.jsx";
import Logos from "./Logos/Index.jsx";
import NewsCategories from "./NewsCategories/Index.jsx";
import WhyChooseUsItems from "./WhyChooseUsItems/Index.jsx";
import TravelSupport from "./TravelSupport/Index.jsx";
import FareFlightFeatures from "./FareFlightFeatures/Index.jsx";
import MinorsLounge from "./MinorsLounge/Index.jsx";
import BestTravelers from "./BestTravelers/Index.jsx";
import PageSections from "./PageSections/Index.jsx";
import About from "./About/Index.jsx";
import Application from "./Application/Index.jsx";
import Newsletter from "./Newsletter/Index.jsx";
import WhyChooseUsBanners from "./WhyChooseUsBanners/Index.jsx";
import Contact from "./Contact/Index.jsx";
import TourDestinations from "./TourDestinations/Index.jsx";
import Tours from "./Tours/Index.jsx";
import OfferRegistrations from "./OfferRegistrations/Index.jsx";
import TourBookings from "./TourBookings/Index.jsx";
import Umrah from "./Umrah/Index.jsx";
import IntlTours from "./IntlTours/Index.jsx";
import VisaAdmin from "./Visa/Index.jsx";
import LegalDocuments from "./Legal/Index.jsx";
import OnlinePayments    from "./OnlinePayments/Index.jsx";
import CarReservation   from "./CarReservation/Index.jsx";

function AuthRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <AuthRoot />,
    children: [
      { path: "/login", element: <Login /> },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "/banners", element: <Banners /> },
          { path: "/services", element: <Services /> },
          { path: "/salesAgents", element: <SalesAgents /> },
          { path: "/news", element: <News /> },
          { path: "/reels", element: <Reels /> },
          { path: "/offers", element: <Offers /> },
          { path: "/logos", element: <Logos /> },
          { path: "/news-categories", element: <NewsCategories /> },
          { path: "/why-choose-us-items", element: <WhyChooseUsItems /> },
          { path: "/travel-support", element: <TravelSupport /> },
          { path: "/fare-flight-features", element: <FareFlightFeatures /> },
          { path: "/minors-lounge", element: <MinorsLounge /> },
          { path: "/best-travelers", element: <BestTravelers /> },
          { path: "/page-sections", element: <PageSections /> },
          { path: "/about", element: <About /> },
          { path: "/application", element: <Application /> },
          { path: "/newsletter", element: <Newsletter /> },
          { path: "/why-choose-us-banners", element: <WhyChooseUsBanners /> },
          { path: "/contact-form", element: <Contact /> },
          { path: "/tour-destinations", element: <TourDestinations /> },
          { path: "/tours", element: <Tours /> },
          { path: "/offer-registrations", element: <OfferRegistrations /> },
          { path: "/tour-bookings", element: <TourBookings /> },
          { path: "/umrah",      element: <Umrah /> },
          { path: "/intl-tours", element: <IntlTours /> },
          { path: "/visa",             element: <VisaAdmin /> },
          { path: "/legal",            element: <LegalDocuments /> },
          { path: "/online-payments",  element: <OnlinePayments /> },
          { path: "/car-reservation",  element: <CarReservation /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
