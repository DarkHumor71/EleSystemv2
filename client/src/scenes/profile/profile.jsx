import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { setAlert } from "../../actions/alert";
import { registerBuilding } from "../../actions/auth";
import { connect } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";

const Profile = ({ setAlert, registerBuilding }) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // State for editable fields
    const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
    const [isLastNameEditable, setIsLastNameEditable] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);

    // Check if any field is being edited
    const isAnyFieldEditable = isFirstNameEditable || isLastNameEditable || isEmailEditable;

    const handleFormSubmit = (values) => {
        console.log(values);
        try {
            registerBuilding(values);
        } catch (error) {
            setAlert(error.message, "error");
        }
    };

    return (
        <Box m="20px">
            <Header title="Profile" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            {/* First Name Field */}
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="First Name"
                                onBlur={() => setIsFirstNameEditable(false)}
                                onChange={handleChange}
                                value={values.firstName}
                                name="firstName"
                                disabled={!isFirstNameEditable}
                                error={!!touched.firstName && !!errors.firstName}
                                helperText={touched.firstName && errors.firstName}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setIsFirstNameEditable(true)}>
                                                <EditIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ gridColumn: "span 2" }}
                            />

                            {/* Last Name Field */}
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Last Name"
                                onBlur={() => setIsLastNameEditable(false)}
                                onChange={handleChange}
                                value={values.lastName}
                                name="lastName"
                                disabled={!isLastNameEditable}
                                error={!!touched.lastName && !!errors.lastName}
                                helperText={touched.lastName && errors.lastName}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setIsLastNameEditable(true)}>
                                                <EditIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ gridColumn: "span 2" }}
                            />

                            {/* Email Field */}
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={() => setIsEmailEditable(false)}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                disabled={!isEmailEditable}
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setIsEmailEditable(true)}>
                                                <EditIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ gridColumn: "span 4" }}
                            />

                            {/* Non-Editable Fields */}
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Building Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.buildingName}
                                name="buildingName"
                                disabled
                                error={!!touched.buildingName && !!errors.buildingName}
                                helperText={touched.buildingName && errors.buildingName}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.address}
                                name="address"
                                disabled
                                error={!!touched.address && !!errors.address}
                                helperText={touched.address && errors.address}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="State"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.state}
                                name="state"
                                disabled
                                error={!!touched.state && !!errors.state}
                                helperText={touched.state && errors.state}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="City"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.city}
                                name="city"
                                disabled
                                error={!!touched.city && !!errors.city}
                                helperText={touched.city && errors.city}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>

                        {/* Conditionally Render Button */}
                        {isAnyFieldEditable && (
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Save
                                </Button>
                            </Box>
                        )}
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    buildingName: yup.string().required("required"),
    address: yup.string().required("required"),
    state: yup.string().required("required"),
    city: yup.string().required("required"),
});

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    buildingName: "",
    address: "",
    state: "",
    city: "",
};

export default connect(null, { setAlert, registerBuilding })(Profile);