import type { ApartmentFormValues, CreateApartmentProps } from "../../types";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import setAuthtoken from "../../utils/setAuthToken";
import { registerApartment } from "../../actions/apartment";

// Use ApartmentFormValues and CreateApartmentProps from types.d.ts

const CreateApartment: React.FC<CreateApartmentProps> = ({
  setAlert,
  building_id,
  isloading,
  registerApartment,
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isloading || !building_id) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [building_id, isloading]);

  const handleFormSubmit = async (
    values: ApartmentFormValues,
    formikHelpers: FormikHelpers<ApartmentFormValues>
  ) => {
    try {
      setLoading(true);
      setAuthtoken(localStorage.token);
      const payload = {
        ...values,
        building: building_id ?? null,
      };
      const res = await registerApartment(payload);
      if (res && res.work && res.id) navigate("/qrcode", { state: res.id });
    } catch (error: any) {
      console.error("Error creating apartment:", error);
      setAlert("Failed to create apartment. Please try again.", "error");
    } finally {
      setLoading(false);
    }
    formikHelpers.setSubmitting(false);
  };

  return (
    <Box m="20px">
      <Header title="CREATE APARTMENT" subtitle="Create a New Apartment" />
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
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
                type="number"
                label="Apartment Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apartment_number}
                name="apartment_number"
                error={!!touched.apartment_number && !!errors.apartment_number}
                helperText={touched.apartment_number && errors.apartment_number}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="PIN"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pin}
                name="pin"
                error={!!touched.pin && !!errors.pin}
                helperText={touched.pin && errors.pin}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_moderator"
                    checked={Boolean(values.is_moderator)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    color="success"
                  />
                }
                label="Moderator permissions"
              />
              {touched.is_moderator && errors.is_moderator && (
                <FormHelperText error>{errors.is_moderator}</FormHelperText>
              )}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={loading || isSubmitting}
              >
                {loading ? "Creating..." : "Create Apartment"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  apartment_number: yup.string().required("Required"),
  pin: yup.string().required("Required"),
  is_moderator: yup.boolean(),
});

const initialValues: ApartmentFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  apartment_number: "",
  pin: "",
  is_moderator: false,
};

const mapStateToProps = (state: any) => ({
  building_id: state.auth.apartment?.building || null,
  isloading: state.auth.loading,
});

export default connect(mapStateToProps, { setAlert, registerApartment })(
  CreateApartment
);
