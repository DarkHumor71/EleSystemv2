import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminDashboard from "./scenes/dashboard";
import Test from "./scenes/dashboard/test";
import Mod from "./scenes/dashboard/mod";
import Apr from "./scenes/dashboard/apart";
import Profile from "./scenes/profile/profile";
import Expensess from "./scenes/expensess";
import Buildings from "./scenes/contacts";
import Apartment from "./scenes/form/index";
import Line from "./scenes/line";
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
        path: "/tes",
        element: <Test />,
      },
      {
        path: "/mod",
        element: <Mod />

      },
      {
        path: "/apr",
        element: <Apr />,
      },
      {
        path: "/buildings",
        element: <Buildings />,
      },
      {
        path: "/expensess",
        element: <Expensess />,
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/form",
        element: <Apartment />,
      },
      {
        path: "/line",
        element: <Line />,
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
  {
    path: "/dash",
    element: <AdminDashboard />,
  },
  {
    path: "/building",
    element: <BuildingRegister />,
  },
  { index: true, element: <Landing /> },
]);

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

export default App;
