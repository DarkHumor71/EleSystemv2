import { GETAPARTMENTS } from "../actions/types";

export type Apartment = {
  // Define apartment properties as needed
  id?: string;
  [key: string]: any;
};

export type ApartmentAction = {
  type: string;
  payload?: any;
};

const initialState: Apartment[] = [];

const apartmentReducer = (
  state = initialState,
  action: ApartmentAction
): Apartment[] => {
  switch (action.type) {
    case GETAPARTMENTS:
      // You can handle payload here if needed
      return state;
    default:
      return state;
  }
};

export default apartmentReducer;
