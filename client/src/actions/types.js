// Alert actions
export const SET_ALERT = 'SET_ALERT';                // Show alert message
export const REMOVE_ALERT = 'REMOVE_ALERT';          // Remove alert message

// Auth & registration actions
export const BUILDING_REGISTER_SUCCESS = 'BUILDING_REGISTER_SUCCESS'; // Building successfully registered
export const APARTMENT_REGISTER_SUCCESS = 'APARTMENT_REGISTER_SUCCESS'; // Apartment successfully registered
export const REGISTER_FAIL = 'REGISTER_FAIL';        // Registration failed

// Authentication & session
export const APARTMENT_LOADED = 'APARTMENT_LOADED';  // Load logged-in apartment
export const BUILDING_LOADED = 'BUILDING_LOADED';    // Load logged-in building
export const AUTH_ERROR = 'AUTH_ERROR';              // General auth error
export const APARTMENT_LOGIN_SUCCESS = 'APARTMENT_LOGIN_SUCCESS'; // Apartment login successful
export const BUILDING_LOGIN_SUCCESS = 'BUILDING_LOGIN_SUCCESS';   // Building login successful
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';         // Admin login successful
export const LOGIN_FAIL = 'LOGIN_FAIL';              // Login failed
export const LOGOUT = 'LOGOUT';                      // User logged out

// Building management
export const DELETE_BUILDING = 'DELETE_BUILDING';    // Soft-delete a building
export const RESTORE_BUILDING = 'RESTORE_BUILDING';  // Restore a deleted building
export const BUILDING_ERROR = 'BUILDING_ERROR';      // Building-related error

// Apartment management
export const GETAPARTMENTS = 'GETAPARTMENTS';        // Fetch apartments
export const DELETE_APARTMENT = 'DELETE_APARTMENT';  // Soft-delete an apartment
export const RESTORE_APARTMENT = 'RESTORE_APARTMENT';// Restore deleted apartment

// Expenses
export const FETCHBUILDINGEXPENSE = 'FETCHBUILDINGEXPENSE'; // Fetch expenses for a building
export const FETCHAPARTMENTEXPENSES = 'FETCHAPARTMENTEXPENSES'; // Fetch expenses for an apartment
