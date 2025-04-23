import { Box, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import {
  fetchApartmentExpenses,
  fetchBuildingExpense,
} from '../../actions/expense';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Expenses = ({
  building_id,
  isloading,
  fetchBuildingExpense,
  fetchApartmentExpenses,
  apartment_id,
  single = false,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [gcolumns, setGroupColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroupRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (isloading || !building_id) {
        setLoading(true);
        return;
      }

      setLoading(true);

      try {
        if (single) {
          const Data = await fetchApartmentExpenses(apartment_id);

          const cleanedData = Data.map((item, index) => {
            const {
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
            } = item;

            return {
              id: _id || index, // required for MUI DataGrid
              ...rest,
              time: time ? `${time.$numberDecimal} s` : null,
              power: power ? `${power.$numberDecimal} KW` : null,
              cost: cost ? `${cost.$numberDecimal} $` : null,
              'At Time': createdAt
                ? new Date(createdAt).toLocaleTimeString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Unknown',
            };
          });

          setRows(cleanedData);

          if (cleanedData.length > 0) {
            const generatedColumns = Object.keys(cleanedData[0])
              .filter((key) => key !== 'id') // 👑 remove 'id' column completely
              .map((key) => ({
                field: key,
                headerName: key.replace(/_/g, ' ').toUpperCase(),
                flex: 1,
              }));

            setColumns(generatedColumns);
          }
        } else {
          //mod data
          const Data = await fetchBuildingExpense(building_id);
          const cleanedData = Data.map(
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
              time: time ? `${time.$numberDecimal} s` : null,
              power: power ? `${power.$numberDecimal} KW` : null,
              cost: cost ? `${cost.$numberDecimal} $` : null,
              'At Time': createdAt
                ? new Date(createdAt).toLocaleTimeString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Unknown',
            })
          );

          setRows(cleanedData);

          if (cleanedData.length > 0) {
            const generatedColumns = Object.keys(cleanedData[0]).map((key) => ({
              field: key,
              headerName: key.replace(/_/g, ' ').toUpperCase(),
              flex: 1,
            }));
            setColumns(generatedColumns);
          }

          const groupedData = cleanedData.reduce((acc, item) => {
            const aptNum = item.apartment_number;

            if (!acc[aptNum]) {
              acc[aptNum] = {
                id: aptNum,
                apartment_number: aptNum,
                total_cost: 0,
                total_power: 0,
                total_time: 0.0,
                count: 0,
              };
            }

            acc[aptNum].total_cost += parseFloat(item.cost);
            acc[aptNum].total_power += parseFloat(item.power);
            acc[aptNum].total_time =
              parseFloat(item.time.replace(/[A-Za-z]/g, '')) / 60;

            acc[aptNum].count += 1;

            return acc;
          }, {});

          const cleanedGroupData = Object.values(groupedData).map((entry) => ({
            ...entry,
            total_cost: `${entry.total_cost.toFixed(2)} $`,
            total_power: `${entry.total_power.toFixed(2)} KW`,
            total_time: `${entry.total_time.toFixed(2)} min`,
            count: `${entry.count} records`,
          }));

          setGroupRows(cleanedGroupData);

          if (cleanedGroupData.length > 0) {
            setGroupColumns([
              {
                field: 'apartment_number',
                headerName: 'Apartment Number',
                flex: 1,
              },
              { field: 'total_cost', headerName: 'Total Cost', flex: 1 },
              { field: 'total_power', headerName: 'Total Power', flex: 1 },
              { field: 'total_time', headerName: 'Total Time', flex: 1 },
              { field: 'count', headerName: 'Records', flex: 1 },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [building_id, isloading, fetchBuildingExpense, fetchApartmentExpenses]);

  return (
    <Box m="20px">
      <Header title="Expenses" subtitle="List of Expenses" />
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
        }}
      >
        {!single && (
          <DataGrid
            rows={group}
            columns={gcolumns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id || row.apartment_number}
            loading={loading}
            localeText={{
              noRowsLabel: loading ? 'Loading data...' : 'No expenses found',
            }}
          />
        )}
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id || row.apartment_number}
          loading={loading}
          localeText={{
            noRowsLabel: loading ? 'Loading data...' : 'No expenses found',
          }}
        />
      </Box>
    </Box>
  );
};
Expenses.propTypes = {
  building_id: PropTypes.string,
  isloading: PropTypes.bool.isRequired,
  fetchBuildingExpense: PropTypes.func.isRequired,
  fetchApartmentExpenses: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    isloading: state.auth.loading,
    building_id: state.auth.apartment?.building || null,
    apartment_id: state.auth.apartment?._id || null,
  };
};

export default connect(mapStateToProps, {
  fetchBuildingExpense,
  fetchApartmentExpenses,
})(Expenses);
