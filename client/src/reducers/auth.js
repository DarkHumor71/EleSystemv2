import {
  REGISTER_FAIL,
  AUTH_ERROR,
  APARTMENT_LOADED,
  APARTMENT_REGISTER_SUCCESS,
  BUILDING_REGISTER_SUCCESS,
  BUILDING_LOADED,
  BUILDING_LOGIN_SUCCESS,
  APARTMENT_LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case BUILDING_LOGIN_SUCCESS:
      return {
        ...state,
        showPinField: true,
        isAuthenticated: false,
        loading: false,
        building: payload,
      };
    case APARTMENT_LOGIN_SUCCESS:
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuthenticated: true,
        loading: false,
        apartment: payload,
      };
    case APARTMENT_LOADED:
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuthenticated: true,
        loading: false,
        apartment: payload,
      };
    case BUILDING_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        building: payload,
      };
    case APARTMENT_REGISTER_SUCCESS:
    case BUILDING_REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: null,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
