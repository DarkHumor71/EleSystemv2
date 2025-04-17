import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './scenes/profile/profile';
import Expensess from './scenes/expensess/building_expenses';
import Buildings from './scenes/buildings/list_of_building';
import Mod from './scenes/dashboard/mod';
import Apr from './scenes/dashboard/apart';
import Apartments from './scenes/apartment/apartments';
import AdminDashboard from './scenes/dashboard/admin';
import Apartment from './scenes/form/createapartment';
import Qrcode from './scenes/form/qrcode';
import PrivateRoute from './components/routing/privateroute';
import Login from './scenes/login/login';
import MainLayout from './Layout/MainLayout';
import { Provider } from 'react-redux';
import store from './store';
import Landing from './components/Landing';
import Alert from './Layout/Alert';
import BuildingRegister from './scenes/form/createbuilding';
import setAuthToken from './utils/setAuthToken';
import { loadApartment } from './actions/auth';

const router = createBrowserRouter([
  {
    path: '/', // Apply MainLayout for the root
    element: <MainLayout />,
    children: [
      {
        path: '/buildings',
        element: <Buildings />,
      },
      {
        path: '/expenses',
        element: <Expensess />,
      },

      {
        path: '/create_apartment',
        element: <Apartment />,
      },
      {
        path: '/qrcode',
        element: <Qrcode />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <>
        <Alert />
        <Login />
      </>
    ),
  },
  {
    path: '/profile',
    element: <MainLayout side={false} profile={false} />,
    children: [
      {
        path: '/profile',
        element: <PrivateRoute children={<Profile />} />,
      },
    ],
  },

  {
    path: '/dash',
    element: <MainLayout side={false} profile={false} />,
    children: [
      {
        path: '/dash',
        element: (
          <>
            <Alert />
            <PrivateRoute children={<AdminDashboard />} />
          </>
        ),
      },
    ],
  },
  {
    path: '/create_apartment',
    element: <MainLayout side={true} profile={false} />,
    children: [
      {
        path: '/create_apartment',
        element: (
          <>
            <Alert />
            <PrivateRoute children={<Apartment />} />
          </>
        ),
      },
    ],
  },
  {
    path: '/qrcode',
    element: <MainLayout side={true} profile={false} />,
    children: [
      {
        path: '/qrcode',
        element: (
          <>
            <Alert />
            <PrivateRoute children={<Qrcode />} />
          </>
        ),
      },
    ],
  },
  {
    path: '/apartments',
    element: <MainLayout side={true} profile={false} />,
    children: [
      {
        path: '/apartments',
        element: <PrivateRoute children={<Apartments />} />,
      },
    ],
  },
  {
    path: '/mod',
    element: <MainLayout side={true} profile={false} />,
    children: [
      {
        path: '/mod',
        element: (
          <>
            <Alert />
            <PrivateRoute children={<Mod />} />
          </>
        ),
      },
    ],
  },
  {
    path: '/apr',
    element: <MainLayout side={false} />,
    children: [
      {
        path: '/apr',
        element: <Apr />,
      },
    ],
  },
  {
    path: '/create_building',
    element: <MainLayout side={false} profile={false} />,
    children: [
      {
        path: '/create_building',
        element: <BuildingRegister />,
      },
    ],
  },

  { index: true, element: <Landing /> },
]);
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadApartment());
  }, []);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
