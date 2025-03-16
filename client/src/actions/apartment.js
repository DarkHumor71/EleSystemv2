import axios from "axios";
import { setAlert } from "./alert";
import { APARTMENT_REGISTER_SUCCESS, REGISTER_FAIL } from "./types";
import setAuthToken from "../utils/setAuthToken";
export const registerApartment = (data) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);

    const res = await axios.post("/api/apartment", data);
    if (res.data) {
      dispatch({ type: APARTMENT_REGISTER_SUCCESS });
      console.log(res.data);
      return { work: true, id: res.data._id };
    } else {
      dispatch({ type: REGISTER_FAIL });
    }
  } catch (err) {
    dispatch(setAlert("Error", "danger"));
    throw err;
  }
};
