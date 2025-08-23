import { FETCHAPARTMENTEXPENSES, FETCHBUILDINGEXPENSE } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

// Helper to set token for authenticated requests
const setToken = (): void => {
  if (localStorage.token) setAuthToken(localStorage.token);
};

export const fetchBuildingExpense =
  (building: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any[]> => {
    try {
      setToken();
      const response = await axios.get(`/api/expense/building/${building}`);
      if (response.data) {
        dispatch({ type: FETCHBUILDINGEXPENSE });
        return response.data as any[];
      }
      return [];
    } catch (error) {
      dispatch({ type: FETCHBUILDINGEXPENSE });
      return [];
    }
  };

export const fetchApartmentExpenses =
  (apartment_id: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any[]> => {
    try {
      setToken();
      const response = await axios.get(
        `/api/expense/apartment/${apartment_id}`
      );
      if (response.data) {
        dispatch({ type: FETCHAPARTMENTEXPENSES });
        return response.data as any[];
      }
      return [];
    } catch (error) {
      dispatch({ type: FETCHAPARTMENTEXPENSES });
      return [];
    }
  };
