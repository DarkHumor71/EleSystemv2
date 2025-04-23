import { v4 as uuidv4 } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./types";

/**
 * Sets an alert message.
 * @param {string} msg - The message to be displayed in the alert.
 * @param {string} alertType - The type of the alert (e.g., 'danger', 'success').
 * @returns {Function} Dispatches the alert message to the Redux store.
 */
export const setAlert = (msg, alertType) => (dispatch) => {
    const id = uuidv4(); // Generate a unique ID for the alert.

    // Dispatch the action to set the alert with the message, type, and ID.
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id },
    });

    // Remove the alert after 5 seconds.
    setTimeout(() => {
        dispatch({ type: REMOVE_ALERT, payload: id }); // Dispatch the action to remove the alert.
    }, 5000); // Alert will be removed after 5 seconds.
};
