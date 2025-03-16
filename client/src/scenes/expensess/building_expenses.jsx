import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const baseURL = process.env.REACT_APP_API_BASE_URL;
const Expenses = ({ building_id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  axios.defaults.baseURL = baseURL;
  //TODO resolve conflict
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api//expense/building/${building_id}`
        );
        if (response.data) {
          const cleanedData = response.data.map(
            ({
              __v,
              _id,
              apartment,
              deleted_at,
              time,
              power,
              cost,
              updatedAt,
              createdAt,
              ...rest
            }) => ({
              ...rest,
              time: time ? `${time.$numberDecimal} s` : null, // Ensure time exists before calling toString()
              power: power ? `${power.$numberDecimal} KW` : null,
              cost: cost ? `${cost.$numberDecimal} $` : null,
              "At Time": createdAt
                ? new Date(createdAt).toLocaleTimeString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
            })
          );

          console.log(cleanedData);
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
      }
    };
    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Expenses" subtitle="List of Expenses" />
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
Expenses.propTypes = {
  building_id: PropTypes.number.isRequired,
};
const mapStateToProps = (state) => ({
  building_id: state.auth.apartment.building,
});

export default connect(mapStateToProps)(Expenses);
