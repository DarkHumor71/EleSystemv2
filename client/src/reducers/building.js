import { BUILDING_REGISTER_SUCCESS } from "../actions/types";
const initialState = {
  buildings: [],
};

const building = (state = initialState, action) => {
  switch (action.type) {
    case BUILDING_REGISTER_SUCCESS:
      return { ...state, buildings: action.payload };
    default:
      return state;
  }
};

export default building;
