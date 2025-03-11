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
//TODO check
// Delete building
// export const deleteBuilding = (email) => async (dispatch) => {
//   try {
//     await axios.delete(`/building/${email}`);

//     dispatch({
//       type: DELETE_BUILDING,
//       payload: email,
//     });

//     dispatch(setAlert("Building Removed", "success"));
//   } catch (err) {
//     dispatch({
//       type: BUILDING_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status },
//     });
//   }
// };
