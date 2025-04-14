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

//load apartment
export const loadApartment = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({ type: APARTMENT_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};
//Register apartment
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
//Register building
export const registerBuilding =
  ({ name, email, address, state, city, password = null }) =>
  async (dispatch) => {
    setAuthToken(localStorage.token);
    const body = JSON.stringify({
      name,
      email,
      address,
      state,
      city,
      password,
    });
    try {
      const res = await axios.post('/api/building/create', body);
      dispatch({ type: BUILDING_REGISTER_SUCCESS, payload: res.data });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({ type: REGISTER_FAIL });
    }
  };
//Login apartment
export const loginApartment =
  //resident

  (pin, email = null) =>
    async (dispatch) => {
      console.log(email);
      //isNumber
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
        //admin
        const password = pin;
        try {
          const res = await axios.post('/api/building', { email, password });
          localStorage.setItem('token', res.data.token);
          dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: res.data });
          return true;
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
//building login
export const loginBuilding = (email) => async (dispatch) => {
  try {
    const res = await axios.post('/api/building', { email });
    if (res.data.token) {
      dispatch({ type: BUILDING_LOGIN_SUCCESS, payload: res.data });
      localStorage.setItem('token', res.data.token);
      return { exists: true }; // Return response to the component
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
//logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
