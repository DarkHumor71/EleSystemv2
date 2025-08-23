import { v4 as uuidv4 } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./types";

/**
 * Dispatches an alert message to the Redux store and removes it after a timeout.
 *
 * @param msg - The message to display in the alert.
 * @param alertType - The type of alert (e.g., 'danger', 'success').
 * @param timeout - Duration in milliseconds before the alert is removed.
 * @returns Thunk function for Redux dispatch.
 */
export const setAlert =
  (msg: string, alertType: string, timeout: number = 5000) =>
  (dispatch: (action: { type: string; payload: any }) => void): void => {
    const id: string = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });
    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
    }, timeout);
  };
