import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

/**
 * Header component displays a page's title and subtitle with customized styles
 * based on the theme (light or dark) using Material-UI components.
 * It is typically used at the top of a page or section to provide context or description.
 */

import React from "react";

type HeaderProps = {
  title: string;
  subtitle: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb={4}>
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: 0, mb: 1 }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={colors.greenAccent[400]}
        sx={{ fontWeight: 400 }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
