/**
 * @file MainLayout.js
 * @description This component wraps the main layout of the application including Sidebar, Topbar, theming, and routing.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
import { ColorModeContext, useMode } from "../theme";

/**
 * Main layout wrapper with sidebar, topbar, and theme support.
 * @param {boolean} side - Whether to display the sidebar.
 * @param {boolean} profile - Whether to show the profile section in the topbar.
 */
const MainLayout = ({ side = true, profile = true }) => {
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

// Corrected prop type declaration (was `Proptype`)
MainLayout.propTypes = {
    side: PropTypes.bool,
    profile: PropTypes.bool,
};

export default MainLayout;
