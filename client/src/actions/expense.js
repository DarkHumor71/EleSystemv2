import { FETCHAPARTMENTEXPENSES, FETCHBUILDINGEXPENSE } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const fetchBuildingExpense = (building) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);
    const response = await axios.get(`/api/expense/building/${building}`);
    if (response.data) {
      dispatch({ type: FETCHBUILDINGEXPENSE });
      return response.data;
    }
    return [];
  } catch (error) {}
};
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
    return [];
  }
};
