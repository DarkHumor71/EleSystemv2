import { FETCHAPARTMENTEXPENSES, FETCHBUILDINGEXPENSE } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

/**
 * Fetch all expenses for a specific building.
 * @param {string} building - The ID of the building.
 * @returns {Array} Array of expenses if successful, empty array otherwise.
 */
export const fetchBuildingExpense = (building) => async (dispatch) => {
  try {
    // Set auth token for axios if available
    setAuthToken(localStorage.token);

    const response = await axios.get(`/api/expense/building/${building}`);

    if (response.data) {
      dispatch({ type: FETCHBUILDINGEXPENSE });
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching building expenses:', error.message);
    return [];
  }
};

/**
 * Fetch all expenses for a specific apartment.
 * @param {string} apartment_id - The ID of the apartment.
 * @returns {Array} Array of expenses if successful, empty array otherwise.
 */
export const fetchApartmentExpenses = (apartment_id) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);

    const response = await axios.get(`/api/expense/apartment/${apartment_id}`);

    if (response.data) {
      dispatch({ type: FETCHAPARTMENTEXPENSES });
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching apartment expenses:', error.message);
    return [];
  }
};
