/**
 * @file MainLayout.js
 * @description This component wraps the main layout of the application including Sidebar, Topbar, theming, and routing.
 */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "../pages/global/Sidebar";
import Topbar from "../pages/global/Topbar";
import { ColorModeContext, useMode } from "../theme";

type MainLayoutProps = {
  side?: boolean;
  profile?: boolean;
};

const MainLayout: React.FC<MainLayoutProps> = ({
  side = true,
  profile = true,
}) => {
  const [isSidebar, setIsSidebar] = useState(true);
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {side && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} profile={profile} />
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MainLayout;
