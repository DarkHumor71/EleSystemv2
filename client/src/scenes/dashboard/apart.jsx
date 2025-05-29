import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import LineChart from '../../components/LineChart';
import StatBox from '../../components/StatBox';
import PaidIcon from '@mui/icons-material/Paid';
import { useNavigate } from 'react-router-dom';
import { fetchApartmentExpenses } from '../../actions/expense';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Apr = ({ isloading, apartment_id, fetchApartmentExpenses }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total_money, setTotal_money] = useState(0);
  const [total_time, setTotal_time] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchData = async () => {
        try {
          if (isloading && !apartment_id) {
            return;
          }
          const expenses = await fetchApartmentExpenses(apartment_id);
          const cleanedData = expenses.map(
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
              createdAt: createdAt
                ? new Date(createdAt).toLocaleTimeString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : null,
            })
          );
          setData(cleanedData);
          const totalCost = cleanedData.reduce(
            (sum, item) => sum + parseFloat(item.cost || 0),
            0
          );
          const totalTime = cleanedData.reduce(
            (sum, item) => sum + parseFloat(item.time || 0),
            0
          );
          if (totalTime) {
            const hours = Math.floor(totalTime / 3600);
            const minutes = Math.floor((totalTime % 3600) / 60);
            const seconds = Math.floor(totalTime % 60);
            setTotal_time(`${hours}h ${minutes}m ${seconds}s`);
          }
          setTotal_money(totalCost.toFixed(2) + '$');
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [isloading, apartment_id]); // Only include relevant dependencies

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
            title={total_money}
            subtitle="My Spent"
            icon={
              <PaidIcon
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
            title={total_time}
            subtitle="Total time Spent"
            icon={
              <PaidIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Yearly Total Spent on Elevators
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {total_money}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} data={data} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Expenses
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/my_expenses')}
            >
              Show More
            </Button>
          </Box>
          {isloading ? (
            <Typography p="15px">Loading expenses...</Typography>
          ) : !data || data.length === 0 ? (
            <Typography p="15px">No expenses found.</Typography>
          ) : (
            data.slice(-5).map((transaction, i) => (
              <Box
                key={`${transaction.apartment_number}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {transaction.createdAt}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {transaction.time}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]}>{transaction.date}</Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  {transaction.cost}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

Apr.propTypes = {
  building_id: PropTypes.string,
  isloading: PropTypes.bool,
  fetchApartmentExpenses: PropTypes.func.isRequired,
  myApartment: PropTypes.number,
  apartment_id: PropTypes.string,
};

const mapStateToProps = (state) => ({
  building_id: state.auth.apartment?.building || null,
  isloading: state.auth.loading,
  myApartment: state.auth.apartment?.apartment_number || null,
  apartment_id: state.auth.apartment?._id || null,
});

export default connect(mapStateToProps, {
  fetchApartmentExpenses,
})(Apr);
