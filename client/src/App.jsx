import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminDashboard from "./scenes/dashboard";
import Test from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import Buildings from "./scenes/contacts";
import Apartment from "./scenes/form/index";
import Line from "./scenes/line";
import FAQ from "./scenes/faq";
import Login from "./scenes/login/login";
import MainLayout from "./Layout/MainLayout";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/Landing";
import Alert from "./Layout/Alert";
import BuildingRegister from "./scenes/form/building";
import SidebarComponent from "./scenes/global/Sidebar";
const router = createBrowserRouter([
  {
    path: "/", // Apply MainLayout for the root
    element: <MainLayout />,
    children: [
      {
        path: "/side",
        element: <SidebarComponent />,
      },
      {
        path: "/building",
        element: <BuildingRegister />,
      },
      {
        path: "/dash",
        element: <AdminDashboard />,
      },
      {
        path: "/tes",
        element: <Test />,
      },
      {
        path: "/buildings",
        element: <Buildings />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/form",
        element: <Apartment />,
      },
      {
        path: "/line",
        element: <Line />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <Alert />
        <Login />
      </>
    ),
  },
  { index: true, element: <Landing /> },
]);

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

export default App;
