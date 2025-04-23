import { Box, Button, TextField, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import Header from '../../components/Header';
import StatBox from '../../components/StatBox';
import Buldings from '../buildings/list_of_building';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { buildingRes, deleteBuilding } from '../../actions/building';
import { apartmentRes } from '../../actions/apartment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AdminDashboard = ({ deleteBuilding, buildingRes, apartmentRes }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [showTextField, setShowTextField] = useState(false);
  const [buildingCount, setBuildingCount] = useState(0);
  const [apartmentCount, setApartmentCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); // NEW

  const fetchCounts = async () => {
    try {
      const building = await buildingRes();
      const apt = await apartmentRes();
      setBuildingCount(building.length);
      setApartmentCount(apt.length);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  useEffect(() => {
    fetchCounts();
  }, []);

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
            title={buildingCount.toString()}
            subtitle="Building"
            icon={
              <ApartmentIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
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
            title={apartmentCount.toString()}
            subtitle="Apartment"
            icon={
              <CorporateFareIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column" // Stack elements vertically
          alignItems="center"
          justifyContent="center"
          gap={2} // Spacing between elements
          p={2} // Padding for a better layout
        >
          {/* Button Row (Create & Delete on the same line) */}
          <Box display="flex" justifyContent="center" width="100%">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/create_building')}
            >
              Create
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowTextField(true)}
            >
              Delete
            </Button>
          </Box>

          {/* TextField Below */}
          {showTextField && (
            <TextField
              label="Enter email"
              variant="outlined"
              type="email"
              fullWidth
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await deleteBuilding(e.target.value);
                  e.target.value = '';
                  setShowTextField(false);
                  fetchCounts(); // Refresh count
                  setRefreshKey((prev) => prev + 1); // Trigger table refresh
                }
              }}
            />
          )}
        </Box>
        <Box gridColumn="span 9" gridRow="span 2">
          <Buldings head={false} inheritedDeps={[refreshKey]} />
        </Box>
      </Box>
    </Box>
  );
};
AdminDashboard.propTypes = {
  deleteBuilding: PropTypes.func.isRequired,
  buildingRes: PropTypes.func.isRequired,
  apartmentRes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {
  deleteBuilding,
  buildingRes,
  apartmentRes,
})(AdminDashboard);
