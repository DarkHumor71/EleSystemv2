import {Box, Button, Checkbox, FormControlLabel, FormHelperText, TextField,} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {useEffect, useState} from "react";
import {setAlert} from "../../actions/alert";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import setAuthtoken from "../../utils/setAuthToken";
import {registerApartment} from "../../actions/apartment";

const CreateApartment = ({
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

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            setAuthtoken(localStorage.token);
            const payload = {
                ...values,
                building: building_id,
            };
            const res = await registerApartment(payload);
            if (res.work) navigate("/qrcode", {state: res.id});
        } catch (error) {
            console.error("Error creating apartment:", error);
            setAlert("Failed to create apartment. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header title="CREATE APARTMENT" subtitle="Create a New Apartment"/>
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
                                "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="First Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.firstName}
                                name="first_name"
                                error={!!touched.firstName && !!errors.firstName}
                                helperText={touched.firstName && errors.firstName}
                                sx={{gridColumn: "span 2"}}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Last Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lastName}
                                name="last_name"
                                error={!!touched.lastName && !!errors.lastName}
                                helperText={touched.lastName && errors.lastName}
                                sx={{gridColumn: "span 2"}}
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
                                sx={{gridColumn: "span 4"}}
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
                                sx={{gridColumn: "span 2"}}
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
                                sx={{gridColumn: "span 2"}}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="is_moderator"
                                        checked={Boolean(values.is_moderator)}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        color="green"
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
                                disabled={loading}
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
    is_moderator: yup.boolean(),
});

const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    apartment_number: 0,
    pin: "",
    is_moderator: false,
};

CreateApartment.propTypes = {
    setAlert: PropTypes.func.isRequired,
    building_id: PropTypes.string,
    isloading: PropTypes.bool.isRequired,
    registerApartment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    building_id: state.auth.apartment?.building || null,
    isloading: state.auth.loading,
});

export default connect(mapStateToProps, {setAlert, registerApartment})(
    CreateApartment
);
