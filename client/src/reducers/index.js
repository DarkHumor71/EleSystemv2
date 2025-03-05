import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import building from "./building";
export default combineReducers({ alert, auth, building });
