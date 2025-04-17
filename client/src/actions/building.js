import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import { DELETE_BUILDING, RESTORE_BUILDING } from './types';

export const deleteBuilding = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);
    const res = await axios.delete(`/api/building/${email}`);
    if (res.data) {
      dispatch({ type: DELETE_BUILDING });
      return res.data;
    }
    return null;
  } catch (error) {
    console.error('Error deleting building:', error);
    return null;
  }
};

export const restoreBuilding = (email) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);
    const res = await axios.patch(`/api/building/${email}`);
    if (res.data) {
      dispatch({ type: RESTORE_BUILDING });
      return res.data;
    }
    return null;
  } catch (error) {
    console.error('Error restoring building:', error);
    return null;
  }
};
