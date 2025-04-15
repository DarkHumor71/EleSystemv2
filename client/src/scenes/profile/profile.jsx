import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/Header';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import Back Icon
import { tokens } from '../../theme';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({
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
  const isNonMobile = useMediaQuery('(min-width:600px)');

  // State for editable fields
  const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
  const [isLastNameEditable, setIsLastNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  // Check if any field is being edited
  const isAnyFieldEditable =
    isFirstNameEditable || isLastNameEditable || isEmailEditable || flag;

  // Function to handle back navigation
  const handleBack = () => {
    navigate('/apr');
  };

  const handleFormSubmit = async (values) => {
    try {
      const res = await axios.put('/api/auth', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });

      console.log('Update successful:', res.data);
      // Optionally, show a success message or update local state here
    } catch (error) {
      console.error(
        'Error updating profile:',
        error.response?.data || error.message
      );
      // Handle errors gracefully (e.g., show error message to user)
    }
  };

  const initialValues = {
    firstName,
    lastName,
    email,
    buildingName: buildingName, // You can make these dynamic too
    address: address,
    state: state,
    city: city,
    pin: pin, //pin
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Header title="Profile" />
      {/* Back Button */}
      <Box display="flex" alignItems="center" mb="20px">
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Back</Typography>
      </Box>

      {/* Main Content */}
      <Box>
        {/* Desktop Layout: QR Code on the side */}
        {isNonMobile && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {/* Form Fields */}
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
                }) => (
                  <form onSubmit={handleSubmit}>
                    {/* Grid Layout for Fields */}
                    <Box
                      display="grid"
                      gap="20px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        '& > div': {
                          gridColumn: isNonMobile ? undefined : 'span 4',
                        },
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
                        sx={{ gridColumn: 'span 2' }}
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
                        sx={{ gridColumn: 'span 2' }}
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
                        sx={{ gridColumn: 'span 4' }}
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
                        sx={{ gridColumn: 'span 2' }}
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
                        sx={{ gridColumn: 'span 2' }}
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
                        sx={{ gridColumn: 'span 2' }}
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
                        sx={{ gridColumn: 'span 2' }}
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
                        sx={{ gridColumn: 'span 2' }}
                      />
                    </Box>
                    {/* Save Button */}
                    {isAnyFieldEditable && (
                      <Box mt="40px" display="flex" justifyContent="end">
                        <Button
                          type="submit"
                          color="secondary"
                          variant="contained"
                          sx={{ fontSize: '1rem', px: 4 }}
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
              {/* QR Code Section */}
              <Box
                component="img"
                src={`  https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}}`}
                alt="QR Code"
                sx={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  border: '2px solid #e0e0e0',
                  objectFit: 'contain',
                  mx: 10, // Center the QR code horizontally
                  my: 0, // Add margin top and bottom
                }}
              />
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
        {/* Mobile Layout: QR Code stacked below fields */}
        {!isNonMobile && (
          <Box>
            {/* Form Fields */}
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
                  {/* Grid Layout for Fields */}
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      '& > div': { gridColumn: 'span 4' }, // Full width on mobile
                    }}
                  >
                    {/* Fields go here (same as above) */}
                  </Box>
                  {/* Save Button */}
                  {isAnyFieldEditable && (
                    <Box mt="40px" display="flex" justifyContent="end">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        sx={{ fontSize: '1rem', px: 4 }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </form>
              )}
            </Formik>
            {/* QR Code Section */}
            <Box
              mt="40px"
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Box
                component="img"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`}
                alt="QR Code"
                sx={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  border: '2px solid #e0e0e0',
                  objectFit: 'contain',
                  mx: 'auto', // Center the QR code horizontally
                }}
              />
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

// Validation Schema
const checkoutSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  buildingName: yup.string().required('Building Name is required'),
  address: yup.string().required('Address is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  pin: yup.string().required('PIN Code is required'),
});

Profile.prototype = {
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  buildingName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  pin: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const apartment = state.auth.apartment || {};
  return {
    id: apartment._id,
    email: apartment.email || '',
    lastName: apartment.last_name || '',
    firstName: apartment.first_name || '',
    buildingName: state.auth.building?.name || '',
    address: state.auth.building?.address || '',
    state: state.auth.building?.state || '',
    city: state.auth.building?.city || '',
    pin: state.auth.apartment.pin || '',
  };
};

export default connect(mapStateToProps, { setAlert })(Profile);
