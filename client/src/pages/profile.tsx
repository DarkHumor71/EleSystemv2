import type { ProfileProps } from "../types";
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../components/Header";
import { setAlert } from "../actions/alert";
import { connect } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Qrcode from "./form/qrcode";

// Use ProfileProps from types.d.ts

const Profile: React.FC<ProfileProps> = ({
  setAlert,
  id,
  email,
  lastName,
  firstName,
  buildingName,
  address,
  state,
  city,
  pin,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
  const [isLastNameEditable, setIsLastNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const isAnyFieldEditable =
    isFirstNameEditable || isLastNameEditable || isEmailEditable || flag;

  const handleBack = () => {
    navigate("/apr");
  };

  const handleFormSubmit = async (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await axios.put("/api/auth", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });
      // Optionally, show a success message or update local state here
    } catch (error: any) {
      // Handle errors gracefully (e.g., show error message to user)
      setAlert(
        error.response?.data?.message || error.message || "Update failed",
        "error"
      );
    }
    formikHelpers.setSubmitting(false);
  };

  const initialValues = {
    firstName,
    lastName,
    email,
    buildingName,
    address,
    state,
    city,
    pin,
  };

  return (
    <Box m="20px">
      <Header title="Profile" subtitle="Manage your profile details" />
      <Box display="flex" alignItems="center" mb="20px">
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Back</Typography>
      </Box>
      <Box>
        {isNonMobile && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <Box
                      display="grid"
                      gap="20px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
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
                              <IconButton
                                onClick={() => {
                                  setIsFirstNameEditable(true);
                                  setFlag(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ gridColumn: "span 2" }}
                      />
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
                              <IconButton
                                onClick={() => {
                                  setIsLastNameEditable(true);
                                  setFlag(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ gridColumn: "span 2" }}
                      />
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
                              <IconButton
                                onClick={() => {
                                  setIsEmailEditable(true);
                                  setFlag(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ gridColumn: "span 4" }}
                      />
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
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="PIN Code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.pin}
                        name="pin"
                        disabled
                        error={!!touched.pin && !!errors.pin}
                        helperText={touched.pin && errors.pin}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>
                    {isAnyFieldEditable && (
                      <Box mt="40px" display="flex" justifyContent="end">
                        <Button
                          type="submit"
                          color="secondary"
                          variant="contained"
                          sx={{ fontSize: "1rem", px: 4 }}
                          disabled={isSubmitting}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    )}
                  </form>
                )}
              </Formik>
            </Grid>
            <Grid item xs={12} md={4}>
              <Qrcode id={id} send={false} />
              <Typography
                variant="body1"
                align="center"
                color={colors.grey[100]}
              >
                Scan this QR code for more details.
              </Typography>
            </Grid>
          </Grid>
        )}
        {!isNonMobile && (
          <Box>
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
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{ "& > div": { gridColumn: "span 4" } }}
                  >
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
                            <IconButton
                              onClick={() => {
                                setIsFirstNameEditable(true);
                                setFlag(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ gridColumn: "span 4" }}
                    />
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
                            <IconButton
                              onClick={() => {
                                setIsLastNameEditable(true);
                                setFlag(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ gridColumn: "span 4" }}
                    />
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
                            <IconButton
                              onClick={() => {
                                setIsEmailEditable(true);
                                setFlag(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ gridColumn: "span 4" }}
                    />
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
                      sx={{ gridColumn: "span 4" }}
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
                      sx={{ gridColumn: "span 4" }}
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
                      sx={{ gridColumn: "span 4" }}
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
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="PIN Code"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pin}
                      name="pin"
                      disabled
                      error={!!touched.pin && !!errors.pin}
                      helperText={touched.pin && errors.pin}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </Box>
                  {isAnyFieldEditable && (
                    <Box mt="40px" display="flex" justifyContent="end">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        sx={{ fontSize: "1rem", px: 4 }}
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </form>
              )}
            </Formik>
            <Box
              mt="40px"
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Qrcode id={id} send={false} />
              <Typography
                variant="body1"
                align="center"
                color={colors.grey[100]}
              >
                Scan this QR code for more details.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  buildingName: yup.string().required("Building Name is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  pin: yup.string().required("PIN Code is required"),
});

const mapStateToProps = (state: any) => {
  const apartment = state.auth.apartment || {};
  return {
    id: apartment._id,
    email: apartment.email || "",
    lastName: apartment.last_name || "",
    firstName: apartment.first_name || "",
    buildingName: state.auth.building?.name || "",
    address: state.auth.building?.address || "",
    state: state.auth.building?.state || "",
    city: state.auth.building?.city || "",
    pin: state.auth.apartment.pin || "",
  };
};

export default connect(mapStateToProps, { setAlert })(Profile);
