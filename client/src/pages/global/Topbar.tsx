import type { TopbarProps } from "../../types";
import React, { useContext } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { ColorModeContext, tokens } from "../../theme";

// Use TopbarProps from types.d.ts

const Topbar: React.FC<TopbarProps> = ({ profile, logout, setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        sx={{
          display: "flex",
          backgroundColor: colors.primary[400],
          borderRadius: "3px",
        }}
      >
        {/* Example: Add a button to toggle sidebar if setIsSidebar is provided */}
        {setIsSidebar && (
          <IconButton onClick={() => setIsSidebar((prev) => !prev)}>
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {profile && (
          <IconButton component={Link} to="/profile">
            <PersonOutlinedIcon />
          </IconButton>
        )}
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default connect(null, { logout })(Topbar);
