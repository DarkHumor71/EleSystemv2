import {FETCHBUILDINGEXPENSE} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const fetchBuildingExpense = (building) => async (dispatch) => {
    try {
        setAuthToken(localStorage.token);
        const response = await axios.get(`/api/expense/building/${building}`);
        if (response.data) {
            dispatch({type: FETCHBUILDINGEXPENSE});
            return response.data;
        }
    } catch (error) {
    }
};
