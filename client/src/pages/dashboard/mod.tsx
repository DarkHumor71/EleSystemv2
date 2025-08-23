import type { ModProps } from "../../types";
import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { fetchBuildingExpense } from "../../actions/expense";
import { deleteApartment, fetchApartments } from "../../actions/apartment";

// Use ModProps from types.d.ts

const Mod: React.FC<ModProps> = ({
  isloading,
  building_id,
  fetchBuildingExpense,
  fetchApartments,
  deleteApartment,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [showPinField, setShowPinField] = useState(false);
  const [apartment_numbers, setApartment_numbers] = useState<number>(0);
  const [total_money, setTotal_money] = useState<string>("0");
  const [total_time, setTotal_time] = useState<string>("0");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchData = async () => {
        if (isloading || !building_id) return;
        try {
          const apts = await fetchApartments(building_id);
          setApartment_numbers(apts.length);
          const Data = await fetchBuildingExpense(building_id);
          const cleanedData = Data.map((item: any) => {
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
              ...rest,
              time: time ? `${time.$numberDecimal} s` : null,
              power: power ? `${power.$numberDecimal} KW` : null,
              cost: cost ? `${cost.$numberDecimal} $` : null,
              createdAt: createdAt
                ? new Date(createdAt).toLocaleTimeString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
            };
          });
          const totalCost = cleanedData.reduce(
            (sum: number, item: any) => sum + parseFloat(item.cost || 0),
            0
          );
          const totalTime = cleanedData.reduce(
            (sum: number, item: any) => sum + parseFloat(item.time || 0),
            0
          );
          if (totalTime) {
            const hours = Math.floor(totalTime / 3600);
            const minutes = Math.floor((totalTime % 3600) / 60);
            const seconds = Math.floor(totalTime % 60);
            setTotal_time(`${hours}h ${minutes}m ${seconds}s`);
          }
          setTotal_money(totalCost.toFixed(2) + "$");
          setData(cleanedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [
    isloading,
    building_id,
    fetchBuildingExpense,
    fetchApartments,
    refreshKey,
  ]);

  return (
    <React.Fragment>
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
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              isProgress={false}
              title={apartment_numbers.toString()}
              subtitle="Apartments"
              increase=""
              icon={
                <ApartmentIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              title={total_money}
              subtitle="Total Building Spent"
              increase=""
              icon={
                <PaidIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              title={total_time}
              subtitle="Time Spent"
              increase=""
              icon={
                <PaidIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 2"
            sx={{
              backgroundColor: colors.primary[400],
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Box display="flex" gap="10px">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/create_apartment")}
              >
                Create
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowPinField(!showPinField)}
              >
                Delete
              </Button>
            </Box>
            {/* TextField Below */}
            {showPinField && (
              <TextField
                label="Enter apartment email"
                variant="outlined"
                fullWidth
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    await deleteApartment((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                    setShowPinField(false);
                    setRefreshKey((prev) => prev + 1);
                  }
                }}
              />
            )}
          </Box>
          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            sx={{ backgroundColor: colors.primary[400] }}
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex"
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
                  ${total_money}
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
            sx={{ backgroundColor: colors.primary[400], overflow: "auto" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              color={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
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
            {data.slice(-5).map((transaction, i) => (
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
                </Box>
                <Box
                  sx={{ backgroundColor: colors.greenAccent[500] }}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  ${transaction.cost}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  building_id: state.auth.apartment?.building || "",
  isloading: state.auth.loading,
});

export default connect(mapStateToProps, {
  fetchBuildingExpense,
  fetchApartments,
  deleteApartment,
})(Mod);
