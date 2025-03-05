import React, { useState } from "react";
import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebar, setIsSidebar] = useState(true);
  const [theme, colorMode] = useMode(); // Ensure useMode is implemented correctly

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalize CSS and apply baseline styles */}
        <div className="app">
          <Sidebar isSidebar={isSidebar} /> {/* Pass sidebar state */}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} /> {/* Pass setter for sidebar state */}
            <Outlet /> {/* Render nested routes */}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MainLayout;