import { Box, useTheme, Button, } from "@mui/material";
import { tokens } from "../../theme";
import ApartmentIcon from '@mui/icons-material/Apartment';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import Buldings from "../../scenes/contacts";




const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCreateClick = () => {
    window.location.href = "/building";
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Building"
            progress="0.75"
            increase="+14%"
            icon={
              <ApartmentIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Apartment"
            progress="0.50"
            increase="+21%"
            icon={
              <CorporateFareIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          gridTemplateRows="repeat(3, 1fr)"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            <Button variant="contained" color="primary" onClick={handleCreateClick}>Create</Button>
          </Box>
          <Box>
            <Button variant="contained" color="secondary">Delete</Button>
          </Box>
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
        >
          <Buldings />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
