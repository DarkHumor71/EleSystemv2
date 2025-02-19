import React from "react";
import Navbar from "../components/layout/Navbar";
import Landing from "../components/layout/Landing";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div></div>
      <Outlet />
    </>
  );
};

export default MainLayout;
