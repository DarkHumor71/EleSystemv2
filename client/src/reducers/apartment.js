import {GETAPARTMENTS} from "../actions/types";

const initialState = [];
export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case GETAPARTMENTS:
            return state;
        default:
            return state;
    }
}
