// Alert actions
export const SET_ALERT = "SET_ALERT"; // Show alert message
export const REMOVE_ALERT = "REMOVE_ALERT"; // Remove alert message

// Registration actions
export const BUILDING_REGISTER_SUCCESS = "BUILDING_REGISTER_SUCCESS"; // Building registered
export const APARTMENT_REGISTER_SUCCESS = "APARTMENT_REGISTER_SUCCESS"; // Apartment registered
export const REGISTER_FAIL = "REGISTER_FAIL"; // Registration failed

// Authentication & session
export const APARTMENT_LOADED = "APARTMENT_LOADED"; // Apartment loaded
export const BUILDING_LOADED = "BUILDING_LOADED"; // Building loaded
export const AUTH_ERROR = "AUTH_ERROR"; // Auth error
export const APARTMENT_LOGIN_SUCCESS = "APARTMENT_LOGIN_SUCCESS"; // Apartment login success
export const BUILDING_LOGIN_SUCCESS = "BUILDING_LOGIN_SUCCESS"; // Building login success
export const ADMIN_LOGIN_SUCCESS = "ADMIN_LOGIN_SUCCESS"; // Admin login success
export const LOGIN_FAIL = "LOGIN_FAIL"; // Login failed
export const LOGOUT = "LOGOUT"; // Logout

// Building management
export const DELETE_BUILDING = "DELETE_BUILDING"; // Delete building
export const RESTORE_BUILDING = "RESTORE_BUILDING"; // Restore building
export const BUILDING_ERROR = "BUILDING_ERROR"; // Building error
export const FETCH_ALL_BUILDING = "FETCH_ALL_BUILDING"; // Fetch all buildings

// Apartment management
export const GETAPARTMENTS = "GETAPARTMENTS"; // Get apartments
export const DELETE_APARTMENT = "DELETE_APARTMENT"; // Delete apartment
export const RESTORE_APARTMENT = "RESTORE_APARTMENT"; // Restore apartment

// Expenses
export const FETCHBUILDINGEXPENSE = "FETCHBUILDINGEXPENSE"; // Fetch building expenses
export const FETCHAPARTMENTEXPENSES = "FETCHAPARTMENTEXPENSES"; // Fetch apartment expenses

// TypeScript enum for action types
export enum ActionTypes {
  SET_ALERT = "SET_ALERT",
  REMOVE_ALERT = "REMOVE_ALERT",
  BUILDING_REGISTER_SUCCESS = "BUILDING_REGISTER_SUCCESS",
  APARTMENT_REGISTER_SUCCESS = "APARTMENT_REGISTER_SUCCESS",
  REGISTER_FAIL = "REGISTER_FAIL",
  APARTMENT_LOADED = "APARTMENT_LOADED",
  BUILDING_LOADED = "BUILDING_LOADED",
  AUTH_ERROR = "AUTH_ERROR",
  APARTMENT_LOGIN_SUCCESS = "APARTMENT_LOGIN_SUCCESS",
  BUILDING_LOGIN_SUCCESS = "BUILDING_LOGIN_SUCCESS",
  ADMIN_LOGIN_SUCCESS = "ADMIN_LOGIN_SUCCESS",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
  DELETE_BUILDING = "DELETE_BUILDING",
  RESTORE_BUILDING = "RESTORE_BUILDING",
  BUILDING_ERROR = "BUILDING_ERROR",
  FETCH_ALL_BUILDING = "FETCH_ALL_BUILDING",
  GETAPARTMENTS = "GETAPARTMENTS",
  DELETE_APARTMENT = "DELETE_APARTMENT",
  RESTORE_APARTMENT = "RESTORE_APARTMENT",
  FETCHBUILDINGEXPENSE = "FETCHBUILDINGEXPENSE",
  FETCHAPARTMENTEXPENSES = "FETCHAPARTMENTEXPENSES",
}
