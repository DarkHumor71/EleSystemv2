import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../theme";
import Header from "../components/Header";
import { fetchApartments } from "../actions/apartment";
import { connect } from "react-redux";

type ApartmentRow = {
  id?: string;
  apartment_number?: string;
  [key: string]: any;
};

type ApartmentsProps = {
  building_id?: string | null;
  isloading: boolean;
  fetchApartments: (building_id: string) => Promise<ApartmentRow[]>;
};

const Apartments: React.FC<ApartmentsProps> = ({
  building_id,
  isloading,
  fetchApartments,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState<ApartmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isloading || !building_id) {
        setLoading(true);
        return;
      }
      try {
        setLoading(true);
        const cleanedData = await fetchApartments(building_id);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [building_id, isloading, fetchApartments]);

  return (
    <Box m="20px">
      <Header title="Apartments" subtitle="Apartments in your Building" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) =>
            row.id ?? row.apartment_number ?? `row-${Math.random()}`
          }
          loading={loading}
          localeText={{
            noRowsLabel: loading ? "Loading data..." : "No expenses found",
          }}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  isloading: state.auth.loading,
  building_id: state.auth.apartment?.building || null,
});

export default connect(mapStateToProps, { fetchApartments })(Apartments);
