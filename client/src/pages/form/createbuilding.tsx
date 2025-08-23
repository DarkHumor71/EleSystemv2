import type { BuildingFormValues, BuildingRegisterProps } from "../../types";
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { setAlert } from "../../actions/alert";
import { registerBuilding } from "../../actions/auth";
import { connect } from "react-redux";
import Qrcode from "./qrcode";

// Use BuildingFormValues and BuildingRegisterProps from types.d.ts

const BuildingRegister: React.FC<BuildingRegisterProps> = ({
  setAlert,
  registerBuilding,
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showQRcode, setShowQRcode] = useState(false);
  const [QRid, setQRid] = useState<string | null>(null);

  const handleFormSubmit = async (
    values: BuildingFormValues,
    formikHelpers: FormikHelpers<BuildingFormValues>
  ) => {
    try {
      const ret = await registerBuilding(values);
      if (ret && ret.work) {
        setShowQRcode(true);
        setQRid(ret.apartment_id ?? null);
      } else {
        setShowQRcode(false);
        setQRid(null);
      }
    } catch (error: any) {
      setAlert(error.message, "error");
    }
    formikHelpers.setSubmitting(false);
  };

  return (
    <Box m="20px">
      <Header title="CREATE BUILDING" subtitle="Create a New Building" />
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
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* ...existing TextField code... */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Building name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
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
                error={!!touched.pin && !!errors.pin}
                helperText={touched.pin && errors.pin}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apartment Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apartmentNumber}
                name="apartmentNumber"
                error={!!touched.apartmentNumber && !!errors.apartmentNumber}
                helperText={touched.apartmentNumber && errors.apartmentNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Apartment Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apartmentEmail}
                name="apartmentEmail"
                error={!!touched.apartmentEmail && !!errors.apartmentEmail}
                helperText={touched.apartmentEmail && errors.apartmentEmail}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Create New Building
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {showQRcode && <Qrcode id={QRid} />}
    </Box>
  );
};

// 🛡️ Validation Schema
const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  address: yup.string().required("required"),
  state: yup.string().required("required"),
  city: yup.string().required("required"),
  pin: yup.string().required("required"),
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  apartmentNumber: yup.string().required("required"),
  apartmentEmail: yup.string().email("invalid email").required("required"),
});

// 🧾 Initial Values
const initialValues: BuildingFormValues = {
  name: "",
  email: "",
  address: "",
  state: "",
  city: "",
  pin: "",
  firstName: "",
  lastName: "",
  apartmentNumber: "",
  apartmentEmail: "",
};

export default connect(null, { setAlert, registerBuilding })(BuildingRegister);
