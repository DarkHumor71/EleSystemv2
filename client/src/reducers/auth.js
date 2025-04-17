import {
  ADMIN_LOGIN_SUCCESS,
  APARTMENT_LOADED,
  APARTMENT_LOGIN_SUCCESS,
  APARTMENT_REGISTER_SUCCESS,
  AUTH_ERROR,
  BUILDING_LOADED,
  BUILDING_LOGIN_SUCCESS,
  BUILDING_REGISTER_SUCCESS,
  DELETE_APARTMENT,
  DELETE_BUILDING,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_FAIL,
  RESTORE_APARTMENT,
  RESTORE_BUILDING,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isResident: false,
  isModerator: false,
  loading: true,
  apartment: null,
  building: null,
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        showPinField: true,
        isAuthenticated: true,
        loading: false,
        building: payload,
        is_admin: true,
        isResident: false,
        isModerator: false,
      };
    case BUILDING_LOGIN_SUCCESS:
      return {
        isResident: false,
        isModerator: false,
        apartment: null,
        showPinField: true,
        isAuthenticated: false,
        loading: false,
        building: payload,
      };
    case APARTMENT_LOGIN_SUCCESS:
      return {
        ...state,
        token: localStorage.getItem('token'),
        isAuthenticated: true,
        loading: false,
        apartment: payload.length > 1 ? payload : payload,
        isResident: payload.length > 1,
        isModerator: payload.moderator,
      };
    case APARTMENT_LOADED:
      return {
        ...state,
        token: localStorage.getItem('token'),
        isAuthenticated: true,
        loading: false,
        apartment: payload.token ? payload.token : payload.apartment,
        building: payload.token ? payload.token : payload.building,
        isResident: !payload.token,

        isModerator: payload.apartment.is_moderator,
      };
    case BUILDING_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        building: payload,
      };
    case BUILDING_REGISTER_SUCCESS:
    case APARTMENT_REGISTER_SUCCESS:
      return {
        ...state,
      };
    case REGISTER_FAIL:
      return {
        ...state,
      };
    case AUTH_ERROR:
    case LOGOUT:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case DELETE_BUILDING:
      return {
        ...state,
        status: 'deleted',
        message: 'Building and related data deleted',
      };
    case RESTORE_BUILDING:
      return {
        ...state,
        status: 'restored',
        message: 'Building and related data restored',
      };
    case DELETE_APARTMENT:
      return {
        ...state,
        status: 'deleted',
        message: 'Apartment and related expenses deleted',
      };
    case RESTORE_APARTMENT:
      return {
        ...state,
        status: 'restored',
        message: 'Apartment and related expenses restored',
      };
    default:
      return state;
  }
}
