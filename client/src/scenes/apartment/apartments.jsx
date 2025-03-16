import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
const Apartments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "x-auth-token": localStorage.token,
          },
        };
        const id = 90;
        const response = await axios.get(
          `/api/apartment/building/${id}`,
          config
        );

        if (response.data) {
          const cleanedData = response.data.map(
            ({ deleted_at, _id, building, ...rest }) => ({
              ...rest,

            })
          );
          setRows(cleanedData);
          /*   if (response.data) {
                    const cleanedData = response.data.map(
                      ({ __v, _id, apartment, deleted_at, time, power, cost, updatedAt, createdAt, ...rest }) => ({
                        ...rest,
                        time: time ? `${time.$numberDecimal} s` : null, // Ensure time exists before calling toString()
                        power: power ? `${power.$numberDecimal} KW` : null,
                        cost: cost ? `${cost.$numberDecimal} $` : null,
                        "At Time": createdAt ? new Date(createdAt).toLocaleTimeString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        }) : null
                      })
                    );*/
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
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
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
          getRowId={(row) => row.id || row.apartment_number} // Ensure there's a unique ID
        />
      </Box>
    </Box>
  );
};
export default Apartments;
