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

export const registerApartment = (data) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);

    const res = await axios.post('/api/apartment', data);
    if (res.data) {
      dispatch({ type: APARTMENT_REGISTER_SUCCESS });
      return { work: true, id: res.data._id };
    } else {
      dispatch({ type: REGISTER_FAIL });
    }
  } catch (err) {
    dispatch(setAlert('Error', 'danger'));
    throw err;
  }
};
export const fetchApartments = (building) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);
    const response = await axios.get(`/api/apartment/building/${building}`);

    if (response.data) {
      const cleanedData = response.data
        .filter((apartment) => !apartment.deleted_at)
        .map(({ deleted_at, _id, building, ...rest }) => ({
          ...rest,
        }));

      dispatch({ type: GETAPARTMENTS });
      return cleanedData;
    } else {
    }
  } catch (err) {
    dispatch(setAlert('Error', 'danger'));
    throw err;
  }
};

export const deleteApartment = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);
    const res = await axios.delete(`/api/apartment/${email}`);
    if (res.data) {
      dispatch({ type: DELETE_APARTMENT });
      return res.data;
    }
    return null;
  } catch (error) {
    console.error('Error deleting apartment:', error);
    return null;
  }
};

export const restoreApartment = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);
    const res = await axios.patch(`/api/apartment/${email}`);
    if (res.data) {
      dispatch({ type: RESTORE_APARTMENT });
      return res.data;
    }
    return null;
  } catch (error) {
    console.error('Error restoring apartment:', error);
    return null;
  }
};
