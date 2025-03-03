import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Line from "./scenes/line";
import FAQ from "./scenes/faq";
import Login from "./scenes/login/login";
import MainLayout from "./Layout/MainLayout";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/Landing";
import Alert from "./Layout/Alert";

const router = createBrowserRouter([
  {
    path: "/", // Apply MainLayout for the root
    element: <MainLayout />,
    children: [
      {
        path: "/dash",
        element: <Dashboard />,
      },
      {
        path: "/contacts",
        element: <Contacts />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/form",
        element: <Form />,
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
