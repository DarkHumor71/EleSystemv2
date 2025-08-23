import axios from "axios";
import {
  ADMIN_LOGIN_SUCCESS,
  APARTMENT_LOADED,
  APARTMENT_LOGIN_SUCCESS,
  APARTMENT_REGISTER_SUCCESS,
  AUTH_ERROR,
  BUILDING_LOGIN_SUCCESS,
  BUILDING_REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_FAIL,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Helper to set token for authenticated requests
const setToken = (): void => {
  if (localStorage.token) setAuthToken(localStorage.token);
};

export interface RegisterApartmentParams {
  building: string;
  pin: string;
  is_moderator: boolean;
}

export interface RegisterBuildingParams {
  name: string;
  email: string;
  address: string;
  state: string;
  city: string;
  password?: string | null;
  pin: string;
  firstName: string;
  lastName: string;
  apartmentNumber: string;
  apartmentEmail: string;
}

export const loadApartment =
  () =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<void> => {
    setToken();
    try {
      const res = await axios.get("/api/auth");
      const data = res.data as { is_admin?: boolean };
      if (data.is_admin) {
        dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: data });
      } else {
        dispatch({ type: APARTMENT_LOADED, payload: data });
      }
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

export const registerApartment =
  ({ building, pin, is_moderator }: RegisterApartmentParams) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<void> => {
    setToken();
    const body = { building, pin, is_moderator };
    try {
      const res = await axios.post("/api/apartment", body);
      dispatch({ type: APARTMENT_REGISTER_SUCCESS, payload: res.data });
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        errors.forEach((error: { msg: string }) =>
          setAlert(error.msg, "danger")(dispatch)
        );
      }
      dispatch({ type: REGISTER_FAIL });
    }
  };

export const registerBuilding =
  (params: RegisterBuildingParams) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<{ work: boolean; apartment_id?: string } | false> => {
    setToken();
    const body = {
      name: params.name,
      email: params.email,
      address: params.address,
      state: params.state,
      city: params.city,
      password: params.password ?? null,
      pin: params.pin,
      first_name: params.firstName,
      last_name: params.lastName,
      apartment_number: params.apartmentNumber,
      apartmentEmail: params.apartmentEmail,
    };
    try {
      const res = await axios.post("/api/building/create", body);
      const data = res.data as { apartment: { _id: string } };
      dispatch({ type: BUILDING_REGISTER_SUCCESS, payload: data });
      return { work: true, apartment_id: data.apartment._id };
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        errors.forEach((error: { msg: string }) =>
          setAlert(error.msg, "danger")(dispatch)
        );
      }
      dispatch({ type: LOGIN_FAIL });
      return false;
    }
  };

export const loginApartment =
  (pin: string, email: string | null = null) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<
    { work: boolean; mod?: boolean } | { admin: boolean } | false | undefined
  > => {
    // Resident login (4-digit PIN)
    if (!isNaN(Number(pin)) && pin.length === 4) {
      setToken();
      const body = { pin };
      try {
        const res = await axios.post("/api/auth", body);
        const data = res.data as { token: string; moderator?: boolean };
        localStorage.setItem("token", data.token);
        dispatch({ type: APARTMENT_LOGIN_SUCCESS, payload: data });
        return { work: true, mod: data.moderator };
      } catch (err: any) {
        const errors = err?.response?.data?.errors;
        if (errors) {
          errors.forEach((error: { msg: string }) =>
            setAlert(error.msg, "danger")(dispatch)
          );
        }
        dispatch({ type: LOGIN_FAIL });
        return false;
      }
    } else if (email && pin) {
      // Admin login using email/password
      const password = pin;
      try {
        const res = await axios.post("/api/building", { email, password });
        const data = res.data as { token: string };
        localStorage.setItem("token", data.token);
        dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: data });
        return { admin: true };
      } catch (err: any) {
        const errors = err?.response?.data?.errors;
        if (errors) {
          errors.forEach((error: { msg: string }) =>
            setAlert(error.msg, "danger")(dispatch)
          );
        }
        dispatch({ type: LOGIN_FAIL });
        return false;
      }
    }
  };

export const loginBuilding =
  (email: string) =>
  async (
    dispatch: (action: { type: string; payload?: any }) => void
  ): Promise<{ exists: boolean }> => {
    try {
      const res = await axios.post("/api/building", { email });
      const data = res.data as { token?: string };
      if (data.token) {
        dispatch({ type: BUILDING_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("token", data.token);
        return { exists: true };
      } else {
        setAlert("Email does not exist", "danger")(dispatch);
        dispatch({ type: LOGIN_FAIL });
        return { exists: false };
      }
    } catch (err) {
      setAlert("Error checking email", "danger")(dispatch);
      throw err;
    }
  };

export const logout =
  () =>
  (dispatch: (action: { type: string; payload?: any }) => void): void => {
    dispatch({ type: LOGOUT });
  };
