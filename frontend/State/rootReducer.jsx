import { combineReducers } from "redux";

import user from "./User/userReducer";
import history from "./History/historyReducer";

const rootReducer = combineReducers({
  user: user,
  history: history,
});

export default rootReducer;
