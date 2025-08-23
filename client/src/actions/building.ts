import setAuthToken from "../utils/setAuthToken";
import axios from "axios";
import { DELETE_BUILDING, FETCH_ALL_BUILDING, RESTORE_BUILDING } from "./types";

// Helper to set token for authenticated requests
const setToken = (): void => {
  if (localStorage.token) setAuthToken(localStorage.token);
};

export const deleteBuilding =
  (email: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any | null> => {
    try {
      setToken();
      const res = await axios.delete(`/api/building/${email}`);
      if (res.data) {
        dispatch({ type: DELETE_BUILDING });
        return res.data;
      }
      return null;
    } catch (error) {
      dispatch({ type: DELETE_BUILDING });
      return null;
    }
  };

export const restoreBuilding =
  (email: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any | null> => {
    try {
      setToken();
      const res = await axios.patch(`/api/building/${email}`);
      if (res.data) {
        dispatch({ type: RESTORE_BUILDING });
        return res.data;
      }
      return null;
    } catch (error) {
      dispatch({ type: RESTORE_BUILDING });
      return null;
    }
  };

export const buildingRes =
  () =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any | null> => {
    try {
      setToken();
      const res = await axios.get("/api/building");
      if (res.data) {
        dispatch({ type: FETCH_ALL_BUILDING });
        return res.data;
      }
      return null;
    } catch (error) {
      dispatch({ type: FETCH_ALL_BUILDING });
      return null;
    }
  };
