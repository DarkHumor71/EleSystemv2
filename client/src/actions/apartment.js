import axios from "axios";
import { setAlert } from "./alert";
import {
  APARTMENT_REGISTER_SUCCESS,
  REGISTER_FAIL,
  GETAPARTMENTS,
} from "./types";
import setAuthToken from "../utils/setAuthToken";
export const registerApartment = (data) => async (dispatch) => {
  try {
    setAuthToken(localStorage.token);

    const res = await axios.post("/api/apartment", data);
    if (res.data) {
      dispatch({ type: APARTMENT_REGISTER_SUCCESS });
      return { work: true, id: res.data._id };
    } else {
      dispatch({ type: REGISTER_FAIL });
    }
  } catch (err) {
    dispatch(setAlert("Error", "danger"));
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
    dispatch(setAlert("Error", "danger"));
    throw err;
  }
};

export const deleteApartment =
  (building, apartment, myApartment) => async (dispatch) => {
    try {
      console.log(apartment);
      if (apartment === myApartment)
        throw new Error("You cannot delete your own apartment.");

      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      const response = await axios.delete(
        `/api/apartment/${building}/${apartment}`
      );
      dispatch(setAlert("Apartment deleted successfully", "success"));
      return true;
    } catch (err) {
      dispatch(setAlert("Error deleting apartment", "danger"));
      console.error(err);
      throw err;
    }
  };
