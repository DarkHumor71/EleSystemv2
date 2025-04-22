import axios from 'axios';
import { setAlert } from './alert';
import {
  APARTMENT_REGISTER_SUCCESS,
  DELETE_APARTMENT,
  GETAPARTMENTS,
  REGISTER_FAIL,
  RESTORE_APARTMENT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

/**
 * Register a new apartment.
 * @param {Object} data - Apartment registration data (e.g., building, pin, etc.).
 * @returns {Object} status and apartment ID on success.
 */
export const registerApartment = (data) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token); // Set token for authenticated requests.

    const res = await axios.post('/api/apartment', data); // Make API request to register apartment.
    if (res.data) {
      dispatch({ type: APARTMENT_REGISTER_SUCCESS }); // Dispatch success action.
      return { work: true, id: res.data._id }; // Return the apartment ID.
    } else {
      dispatch({ type: REGISTER_FAIL }); // Dispatch failure action if registration fails.
    }
  } catch (err) {
    dispatch(setAlert('Error', 'danger')); // Dispatch an error alert.
    throw err; // Re-throw error for further handling.
  }
};

/**
 * Fetch all apartments for a given building.
 * @param {string} building - Building ID.
 * @returns {Array} Filtered list of active apartments (not deleted).
 */
export const fetchApartments = (building) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token); // Set token for authenticated requests.
    const response = await axios.get(`/api/apartment/building/${building}`); // API request to fetch apartments.

    if (response.data) {
      const cleanedData = response.data
        .filter((apartment) => !apartment.deleted_at) // Remove deleted apartments from the list.
        .map(({ deleted_at, _id, building, ...rest }) => ({
          ...rest, // Return apartments with necessary details excluding 'deleted_at' and 'building'.
        }));

      dispatch({ type: GETAPARTMENTS }); // Dispatch action to update apartment list in Redux store.
      return cleanedData; // Return the cleaned apartment list.
    } else {
      // Handle case where no apartments are found (optional handling).
    }
  } catch (err) {
    dispatch(setAlert('Error', 'danger')); // Dispatch an error alert if something goes wrong.
    throw err; // Re-throw error for further handling.
  }
};

/**
 * Delete an apartment by email (soft delete).
 * @param {string} email - The apartment email for deletion.
 * @returns {Object|null} Response data on success, or null on failure.
 */
export const deleteApartment = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token); // Set token for authenticated requests.
    const res = await axios.delete(`/api/apartment/${email}`); // Make API request to delete apartment.

    if (res.data) {
      dispatch({ type: DELETE_APARTMENT }); // Dispatch success action for apartment deletion.
      return res.data; // Return the response data (apartment details).
    }
    return null; // Return null if deletion failed.
  } catch (error) {
    console.error('Error deleting apartment:', error); // Log error for debugging.
    return null; // Return null if an error occurred.
  }
};

/**
 * Restore a deleted apartment by email.
 * @param {string} email - The apartment email for restoration.
 * @returns {Object|null} Response data on success, or null on failure.
 */
export const restoreApartment = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token); // Set token for authenticated requests.
    const res = await axios.patch(`/api/apartment/${email}`); // API request to restore apartment.

    if (res.data) {
      dispatch({ type: RESTORE_APARTMENT }); // Dispatch success action for apartment restoration.
      return res.data; // Return the response data (apartment details).
    }
    return null; // Return null if restoration failed.
  } catch (error) {
    console.error('Error restoring apartment:', error); // Log error for debugging.
    return null; // Return null if an error occurred.
  }
};
