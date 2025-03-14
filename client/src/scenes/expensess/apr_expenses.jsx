import React from 'react'
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
const Apr_expenses = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    //TODO resolve conflict
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "/api/expense/building/67b9e0625fa31dca724d1712"
                );
                if (response.data) {
                    const cleanedData = response.data.map(
                        ({ deleted_at, ...rest }) => rest
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
                    getRowId={(row) => row.id || row._id} // Ensure there's a unique ID
                />
            </Box>
        </Box>
    );
};
export default Apr_expenses
