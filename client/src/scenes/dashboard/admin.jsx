import {Box, Button, TextField, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import Buldings from "../buildings/list_of_building";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const AdminDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [showTextField, setShowTextField] = useState(false);

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
                        title="12,361"
                        subtitle="Building"
                        progress="0.75"
                        increase="+14%"
                        icon={
                            <ApartmentIcon
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
                        title="431,225"
                        subtitle="Apartment"
                        progress="0.50"
                        increase="+21%"
                        icon={
                            <CorporateFareIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 4"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column" // Stack elements vertically
                    alignItems="center"
                    justifyContent="center"
                    gap={2} // Spacing between elements
                    p={2} // Padding for a better layout
                >
                    {/* Button Row (Create & Delete on the same line) */}
                    <Box display="flex" justifyContent="center" width="100%">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/create_building")}
                        >
                            Create
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setShowTextField(true)}
                        >
                            Delete
                        </Button>
                    </Box>

                    {/* TextField Below */}
                    {showTextField && (
                        <TextField label="Enter value" variant="outlined" fullWidth/>
                    )}
                </Box>
                <Box gridColumn="span 9" gridRow="span 2">
                    <Buldings head={false}/>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
