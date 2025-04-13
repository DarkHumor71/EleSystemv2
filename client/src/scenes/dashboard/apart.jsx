<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
=======
import {Box, Button, IconButton, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {mockTransactions} from "../../data/mockData";
>>>>>>> d2f540bd26bc8ab2308deb58f872bfc5da1711d6
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import PaidIcon from "@mui/icons-material/Paid";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchBuildingExpense } from "../../actions/expense";
import { fetchApartments } from "../../actions/apartment";

const Apr = ({
  isloading,
  building_id,
  fetchBuildingExpense,
  fetchApartments,
  myApartment,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total_money, setTotal_money] = useState("$0");
  const [my_spent, setMy_spent] = useState("$0");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchData = async () => {
        try {

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
              apartment_number: apartment?.apartment_number || "N/A",
              time: time ? `${time.$numberDecimal} s` : null,
              power: power ? `${power.$numberDecimal} KW` : null,
              cost: cost ? `$${cost.$numberDecimal}` : null,
              createdAt: createdAt
                ? new Date(createdAt).toLocaleTimeString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : null,
              date: createdAt
                ? new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : null,
            })
          );

          // Calculate total building spent
          const totalCost = cleanedData.reduce(
            (sum, item) => sum + parseFloat(item.cost?.replace('$', '') || 0),
            0
          );
          setTotal_money(`$${totalCost.toFixed(2)}`);

          // Calculate my apartment's spent
          const myCost = cleanedData
            .filter(item => item.apartment_number === myApartment)
            .reduce(
              (sum, item) => sum + parseFloat(item.cost?.replace('$', '') || 0),
              0
            );
          setMy_spent(`$${myCost.toFixed(2)}`);

          setData(cleanedData.slice(0, 5)); // Show only 5 recent expenses
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, 200);

    return () => clearTimeout(timeout);
  }, [isloading, building_id, fetchBuildingExpense, fetchApartments, myApartment]);

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
            title={my_spent}
            subtitle="My Spent"
            icon={
              <PaidIcon
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
            title={total_money}
            subtitle="Total Building Spent"
            icon={
              <PaidIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
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
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
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
              onClick={() => navigate("/expenses")}
            >
              Show More
            </Button>
          </Box>

          {data.map((transaction, i) => (
            <Box
              key={`${transaction.apartment_number}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
=======
import {useNavigate} from "react-router-dom";

const Apr = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
>>>>>>> d2f540bd26bc8ab2308deb58f872bfc5da1711d6
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
<<<<<<< HEAD
                  {transaction.createdAt}
                </Typography>
                <Typography color={colors.grey[100]}>
                  Apt {transaction.apartment_number}
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
=======
                    <StatBox
                        title="18$"
                        subtitle="My Spent"
                        icon={
                            <PaidIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
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
                        title="100$"
                        subtitle="Total Building Spent"
                        icon={
                            <PaidIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
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
                                $190
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton>
                                <DownloadOutlinedIcon
                                    sx={{fontSize: "26px", color: colors.greenAccent[500]}}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box height="250px" m="-20px 0 0 0">
                        <LineChart isDashboard={true}/>
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
                            Recent Expensess
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/expensess")}
                        >
                            {" "}
                            Show More
                        </Button>
                    </Box>
                    {mockTransactions.map((transaction, i) => (
                        <Box
                            key={`${transaction.txId}-${i}`}
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
                                    {transaction.txId}
                                </Typography>
                                <Typography color={colors.grey[100]}>
                                    {transaction.user}
                                </Typography>
                            </Box>
                            <Box color={colors.grey[100]}>{transaction.date}</Box>
                            <Box
                                backgroundColor={colors.greenAccent[500]}
                                p="5px 10px"
                                borderRadius="4px"
                            >
                                ${transaction.cost}
                            </Box>
                        </Box>
                    ))}
                </Box>
>>>>>>> d2f540bd26bc8ab2308deb58f872bfc5da1711d6
            </Box>
        </Box>
    );
};

Apr.propTypes = {
  building_id: PropTypes.string,
  isloading: PropTypes.bool,
  fetchBuildingExpense: PropTypes.func.isRequired,
  fetchApartments: PropTypes.func.isRequired,
  myApartment: PropTypes.string,
};

const mapStateToProps = (state) => ({
  building_id: state.auth.apartment?.building || null,
  isloading: state.auth.loading,
  myApartment: state.auth.apartment?.apartment_number || null,
});

export default connect(mapStateToProps, {
  fetchBuildingExpense,
  fetchApartments,
})(Apr);