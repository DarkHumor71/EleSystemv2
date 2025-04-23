import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

/**
 * Header component displays a page's title and subtitle with customized styles 
 * based on the theme (light or dark) using Material-UI components.
 * It is typically used at the top of a page or section to provide context or description.
 * 
 * @param {Object} props - The component's props
 * @param {string} props.title - The title text to be displayed in a larger, bold font
 * @param {string} props.subtitle - The subtitle text to be displayed in a smaller, lighter font
 * 
 * @returns {ReactNode} - The JSX to be rendered, containing the title and subtitle.
 */
const Header = ({ title, subtitle }) => {
    const theme = useTheme();  // Access the current theme from Material-UI
    const colors = tokens(theme.palette.mode);  // Fetch token-based colors for the theme (light or dark mode)

    return (
        <Box mb="30px">
            <Typography
                variant="h2"  // Typography for the title with 'h2' variant
                color={colors.grey[100]}  // Set the title color based on the theme
                fontWeight="bold"  // Make the title bold
                sx={{ m: "0 0 5px 0" }}  // Set margin for the title (top, right, bottom, left)
            >
                {title}
            </Typography>
            <Typography
                variant="h5"  // Typography for the subtitle with 'h5' variant
                color={colors.greenAccent[400]}  // Set the subtitle color based on the theme
            >
                {subtitle}
            </Typography>
        </Box>
    );
};

export default Header;
