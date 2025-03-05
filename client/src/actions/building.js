import axios from "axios";
import { BUILDING_REGISTER_SUCCESS, REGISTER_FAIL } from "./types";
import { setAlert } from "./alert";
export const fetchBuildings = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/buildings"); // Fetch data from backend
    dispatch({ type: BUILDING_REGISTER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch(setAlert({ type: REGISTER_FAIL }));
  }
};
