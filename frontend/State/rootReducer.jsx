import { combineReducers } from "redux";

import user from "./User/userReducer";

const rootReducer = combineReducers({
  user: user,
  
});

export default rootReducer;
