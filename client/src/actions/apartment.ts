import type { ApartmentData, ApartmentResponse } from "../types";
import axios from "axios";
import { setAlert } from "./alert";
import {
  APARTMENT_REGISTER_SUCCESS,
  DELETE_APARTMENT,
  GETAPARTMENTS,
  REGISTER_FAIL,
  RESTORE_APARTMENT,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Helper to set token for authenticated requests
const setToken = (): void => setAuthToken(localStorage.token);

// Use types from types.d.ts

export const registerApartment =
  (data: ApartmentData) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<ApartmentResponse> => {
    try {
      setToken();
      const res = await axios.post("/api/apartment", data);
      if (res.data && (res.data as { _id?: string })._id) {
        dispatch({ type: APARTMENT_REGISTER_SUCCESS });
        return { work: true, id: (res.data as { _id: string })._id };
      }
      dispatch({ type: REGISTER_FAIL });
      return { work: false };
    } catch (err) {
      setAlert("Failed to register apartment", "danger")(dispatch);
      throw err;
    }
  };

export const fetchApartments =
  (building: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any[]> => {
    try {
      setToken();
      const response = await axios.get(`/api/apartment/building/${building}`);
      if (Array.isArray(response.data)) {
        const cleanedData = response.data
          .filter((apartment: any) => !apartment.deleted_at)
          .map(({ deleted_at, building, ...rest }: any) => ({ ...rest }));
        dispatch({ type: GETAPARTMENTS });
        return cleanedData;
      }
      return [];
    } catch (err) {
      setAlert("Failed to fetch apartments", "danger")(dispatch);
      throw err;
    }
  };

export const deleteApartment =
  (email: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any | null> => {
    try {
      setToken();
      const res = await axios.delete(`/api/apartment/${email}`);
      if (res.data) {
        dispatch({ type: DELETE_APARTMENT });
        return res.data;
      }
      return null;
    } catch (error) {
      setAlert("Failed to delete apartment", "danger")(dispatch);
      return null;
    }
  };

export const restoreApartment =
  (email: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any | null> => {
    try {
      setToken();
      const res = await axios.patch(`/api/apartment/${email}`);
      if (res.data) {
        dispatch({ type: RESTORE_APARTMENT });
        return res.data;
      }
      return null;
    } catch (error) {
      setAlert("Failed to restore apartment", "danger")(dispatch);
      return null;
    }
  };

export const apartmentRes =
  () =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<any | null> => {
    try {
      setToken();
      const res = await axios.get("/api/apartment");
      if (res.data) {
        dispatch({ type: RESTORE_APARTMENT });
        return res.data;
      }
      return null;
    } catch (error) {
      setAlert("Failed to restore apartment", "danger")(dispatch);
      return null;
    }
  };
