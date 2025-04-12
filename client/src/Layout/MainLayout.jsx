import React, {useState} from "react";
import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "../theme";
import {Outlet} from "react-router-dom";
import PropTypes from "prop-types";

const MainLayout = ({side, profile}) => {
    if (side == null) side = true;
    if (profile == null) profile = true;
    const [isSidebar, setIsSidebar] = useState(true);
    const [theme, colorMode] = useMode(); // Ensure useMode is implemented correctly
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    {side && <Sidebar isSidebar={isSidebar}/>}

                    <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} profile={profile}/>
                        <Outlet/>
                        {""}
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

MainLayout.Proptype = {
    side: PropTypes.bool,
    profile: PropTypes.bool,
};
export default MainLayout;
