import axios from 'axios';
import {
  ADMIN_LOGIN_SUCCESS,
  APARTMENT_LOADED,
  APARTMENT_LOGIN_SUCCESS,
  APARTMENT_REGISTER_SUCCESS,
  AUTH_ERROR,
  BUILDING_LOGIN_SUCCESS,
  BUILDING_REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_FAIL,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

/**
 * Load currently authenticated apartment or admin user.
 * Dispatches ADMIN_LOGIN_SUCCESS or APARTMENT_LOADED based on user role.
 */
export const loadApartment = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    if (res.data.is_admin)
      dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: res.data });
    else dispatch({ type: APARTMENT_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

/**
 * Register a new apartment user (resident/moderator).
 * @param {Object} param0 - Contains building ID, pin, and moderator flag.
 */
export const registerApartment =
  ({ building, pin, is_moderator }) =>
    async (dispatch) => {
      setAuthToken(localStorage.token);
      const body = JSON.stringify({ building, pin, is_moderator });

      try {
        const res = await axios.post('/api/apartment', body);
        dispatch({ type: APARTMENT_REGISTER_SUCCESS, payload: res.data });
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({ type: REGISTER_FAIL });
      }
    };

/**
 * Register a building and create its first apartment/moderator.
 * @param {Object} buildingData - Includes building + apartment creation info.
 * @returns {Object} success flag and apartment ID
 */
export const registerBuilding =
  ({
    name,
    email,
    address,
    state,
    city,
    password = null,
    pin,
    firstName,
    lastName,
    apartmentNumber,
    apartmentEmail,
  }) =>
    async (dispatch) => {
      setAuthToken(localStorage.token);
      const body = {
        name,
        email,
        address,
        state,
        city,
        password,
        pin,
        first_name: firstName,
        last_name: lastName,
        apartment_number: apartmentNumber,
        apartmentEmail,
      };

      try {
        const res = await axios.post('/api/building/create', body);
        dispatch({ type: BUILDING_REGISTER_SUCCESS, payload: res.data });
        return { work: true, apartment_id: res.data.apartment._id };
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({ type: REGISTER_FAIL });
      }
    };

/**
 * Login function for apartment residents or building admins.
 * @param {string} pin - PIN or password.
 * @param {string|null} email - Optional email for admin login.
 * @returns {Object|boolean} User role status or false on failure
 */
export const loginApartment = (pin, email = null) => async (dispatch) => {
  console.log(email);

  // Resident login (4-digit PIN)
  if (!isNaN(pin) && pin.length === 4) {
    console.log('pin');
    setAuthToken(localStorage.token);
    const body = {
      pin: pin,
    };
    try {
      const res = await axios.post('/api/auth', body);
      localStorage.setItem('token', res.data.token);
      dispatch({ type: APARTMENT_LOGIN_SUCCESS, payload: res.data });
      return { work: true, mod: res.data.moderator };
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({ type: LOGIN_FAIL });
      return false;
    }
  } else if (email && pin) {
    // Admin login using email/password
    const password = pin;
    try {
      const res = await axios.post('/api/building', { email, password });
      localStorage.setItem('token', res.data.token);
      dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: res.data });
      return { admin: true };
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({ type: LOGIN_FAIL });
      return false;
    }
  }
};

/**
 * Check if building email exists and perform login step 1.
 * @param {string} email - Email to verify.
 * @returns {Object} Status result { exists: true/false }
 */
export const loginBuilding = (email) => async (dispatch) => {
  try {
    const res = await axios.post('/api/building', { email });
    if (res.data.token) {
      dispatch({ type: BUILDING_LOGIN_SUCCESS, payload: res.data });
      localStorage.setItem('token', res.data.token);
      return { exists: true };
    } else {
      dispatch(setAlert('Email does not exist', 'danger'));
      dispatch({ type: LOGIN_FAIL });
      return { exists: false };
    }
  } catch (err) {
    dispatch(setAlert('Error checking email', 'danger'));
    throw err;
  }
};

/**
 * Logout current user.
 * Clears user data from Redux store.
 */
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
