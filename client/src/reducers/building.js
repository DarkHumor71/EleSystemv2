import { BUILDING_REGISTER_SUCCESS } from "../actions/types";
const initialState = {
  buildings: [],
};

const building = (state = initialState, action) => {
  switch (action.type) {
    case BUILDING_REGISTER_SUCCESS:
      return { ...state, buildings: action.payload }; //TODO check
    // case DELETE_BUILDING:
    //   return {
    //     ...state,
    //
    //     building: state.building.filter(
    //       (building) => building._id !== action.payload
    //     ),
    //     loading: false,
    //   };
    // case BUILDING_ERROR:
    //   return {
    //     ...state,
    //
    //     loading: false,
    //   };
    default:
      return state;
  }
};
export default building;
