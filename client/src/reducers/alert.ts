import { REMOVE_ALERT, SET_ALERT } from "../actions/types";

export type Alert = {
  id: string;
  msg: string;
  alertType: string;
};

export type AlertAction =
  | { type: typeof SET_ALERT; payload: Alert }
  | { type: typeof REMOVE_ALERT; payload: string };

const initialState: Alert[] = [];

const alertReducer = (state = initialState, action: AlertAction): Alert[] => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== action.payload);
    default:
      return state;
  }
};

export default alertReducer;
