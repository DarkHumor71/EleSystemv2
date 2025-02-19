import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./components/layout/Landing";
import Login from "./components/layout/auth/login";
import Register from "./components/layout/auth/register";
import Alert from "./layouts/Alert";
import NotFound from "./components/layout/error/Notfound";
import "simple-datatables";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Chart } from "chart.js";
//Redux
import { Provider } from "react-redux";
import store from "./store";
const router = createBrowserRouter([
  {
    path: "/", // Apply MainLayout for the root
    element: <MainLayout />,
    children: [
      {
        index: true, // Index route (HomePage)
        element: <Landing />,
      },
      {
        path: "/login",
        element: (
          <section className="container">
            <Alert />
            <Login />
          </section>
        ),
      },
      {
        path: "/register",
        element: (
          <section className="container">
            <Alert />
            <Register />
          </section>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

export default App;
