import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import setAuthToken from "../../utils/setAuthToken";
const Apartments = ({ building_id, isloading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Local loading state
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isloading || !building_id) {
        setLoading(true);
        return;
      }
      try {
        setLoading(true);
        setAuthToken(localStorage.token);

        const response = await axios.get(
          `/api/apartment/building/${building_id}`
        );

        if (response.data) {
          const cleanedData = response.data.map(
            ({ deleted_at, _id, building, ...rest }) => ({
              ...rest,
            })
          );
          setRows(cleanedData);
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [building_id, isloading]);
  return (
    <Box m="20px">
      {<Header title="Apartments" subtitle="Apartments in your  Building" />}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id || row.apartment_number}
          loading={loading}
          localeText={{
            noRowsLabel: loading ? "Loading data..." : "No expenses found",
          }}
        />
      </Box>
    </Box>
  );
};
Apartments.propTypes = {
  building_id: PropTypes.string,
  isloading: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => {
  return {
    isloading: state.auth.loading,
    building_id: state.auth.apartment?.building || null,
  };
};
export default connect(mapStateToProps)(Apartments);
