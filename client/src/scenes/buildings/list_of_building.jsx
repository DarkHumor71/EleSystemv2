import { Box, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import PropTypes from 'prop-types';
import setAuthToken from '../../utils/setAuthToken';
import { buildingRes } from '../../actions/building';
import { connect } from 'react-redux';

const Buildings = ({ head, buildingRes, inheritedDeps = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  if (head == null) head = true;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAuthToken(localStorage.token);

        const response = await buildingRes();

        if (response) {
          const cleanedData = response.map(
            ({ _id, deleted_at, ...rest }) => rest
          );
          setRows(cleanedData);

          // Assuming response.data contains an array of objects, dynamically generate columns
          if (cleanedData.length > 0) {
            const sampleRow = cleanedData[0];
            const generatedColumns = Object.keys(sampleRow).map((key) => ({
              field: key,
              headerName: key.toUpperCase(),
              flex: 1,
            }));
            setColumns(generatedColumns);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, inheritedDeps);
  return (
    <Box m="20px">
      {head && <Header title="Buildings" subtitle="List of Buildings" />}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id || row.email} // Ensure there's a unique ID
        />
      </Box>
    </Box>
  );
};
Buildings.prototype = {
  head: PropTypes.bool,
};
export default connect(null, {
  buildingRes,
})(Buildings);
