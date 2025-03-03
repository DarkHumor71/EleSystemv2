import axios from "axios";
import {
  APARTMENT_REGISTER_SUCCESS,
  BUILDING_REGISTER_SUCCESS,
  REGISTER_FAIL,
  APARTMENT_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  APARTMENT_LOGIN_SUCCESS,
  BUILDING_LOGIN_SUCCESS,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

//load apartment
export const loadApartment = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    dispatch({ type: APARTMENT_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};
//Register apartment
export const registerApartment =
  ({ building, pin, is_moderator }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ building, pin, is_moderator });
    try {
      const res = await axios.post("/api/apartment", body, config);
      dispatch({ type: APARTMENT_REGISTER_SUCCESS, payload: res.data });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({ type: REGISTER_FAIL });
    }
  };
//Register building
export const registerBuilding =
  ({ name, email, address, state, city, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      name,
      email,
      address,
      state,
      city,
      password,
    });
    try {
      const res = await axios.post("/api/building", body, config);
      dispatch({ type: BUILDING_REGISTER_SUCCESS, payload: res.data });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({ type: REGISTER_FAIL });
    }
  };
//Login apartment
export const loginApartment =
  (pin, email = null) =>
  async (dispatch) => {
    console.log(email);
    if (!isNaN(pin) && pin.length === 4) {
      console.log("pin");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.token,
        },
      };
      const body = JSON.stringify({ pin });
      try {
        const res = await axios.post("/api/auth", body, config);
        localStorage.setItem("token", res.data.token);
        dispatch({ type: APARTMENT_LOGIN_SUCCESS, payload: res.data });
        return true;
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({ type: LOGIN_FAIL });
        return false;
      }
    } else if (email && pin) {
      const password = pin;
      const body = JSON.stringify({ email, password });
      try {
        const res = await axios.post("/api/building/", { email, password });
        localStorage.setItem("token", res.data.token);
        dispatch({ type: APARTMENT_LOGIN_SUCCESS, payload: res.data });
        return true;
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({ type: LOGIN_FAIL });
        return false;
      }
    }
  };
//building login
export const loginBuilding = (email) => async (dispatch) => {
  try {
    const res = await axios.post("/api/building/", { email });
    if (res.data.token) {
      dispatch({ type: BUILDING_LOGIN_SUCCESS, payload: res.data });
      localStorage.setItem("token", res.data.token);
      return { exists: true }; // Return response to the component
    } else {
      dispatch(setAlert("Email does not exist", "danger"));
      dispatch({ type: LOGIN_FAIL });
      return { exists: false };
    }
  } catch (err) {
    dispatch(setAlert("Error checking email", "danger"));
    throw err;
  }
};
