import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

/**
 * StatBox component displays a box that represents a statistic with an optional progress circle, title, subtitle, and increase value.
 * It is typically used to show data metrics in dashboards or statistics views.
 *
 * @param {Object} props
 * @param {string} props.title - The title of the statistic.
 * @param {string} props.subtitle - The subtitle for the statistic.
 * @param {ReactNode} props.icon - The icon displayed alongside the title.
 * @param {boolean} props.isProgress - Flag to determine whether to show the progress circle.
 * @param {number} props.progress - The progress value (0 to 1) to be shown in the progress circle (only when `isProgress` is true).
 * @param {string} props.increase - The increase value that shows the percentage or change in the statistic.
 * @returns {ReactNode} - JSX representing the StatBox component with data and optional progress indicator.
 */
import React from "react";
import type { ReactNode } from "react";
import ProgressCircle from "./ProgressCircle";

type StatBoxProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  isProgress?: boolean;
  progress?: number;
  increase: string;
};

const StatBox: React.FC<StatBoxProps> = ({
  title,
  subtitle,
  icon,
  isProgress = false,
  progress = 0,
  increase,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        {isProgress && <ProgressCircle progress={progress} size={40} />}
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.5}>
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
