import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import { DELETE_BUILDING, RESTORE_BUILDING } from './types';

/**
 * Soft deletes a building by email.
 * @param {string} email - The building's email identifier.
 * @returns {Object|null} - Server response data or null on failure.
 */
export const deleteBuilding = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);

    const res = await axios.delete(`/api/building/${email}`);

    if (res.data) {
      dispatch({ type: DELETE_BUILDING /*, payload: res.data */ });
      return res.data;
    }

    return null;
  } catch (error) {
    console.error('Error deleting building:', error.message);
    return null;
  }
};

/**
 * Restores a soft-deleted building by email.
 * @param {string} email - The building's email identifier.
 * @returns {Object|null} - Server response data or null on failure.
 */
export const restoreBuilding = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);

    const res = await axios.patch(`/api/building/${email}`);

    if (res.data) {
      dispatch({ type: RESTORE_BUILDING /*, payload: res.data */ });
      return res.data;
    }

    return null;
  } catch (error) {
    console.error('Error restoring building:', error.message);
    return null;
  }
};
