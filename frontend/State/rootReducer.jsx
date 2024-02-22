import { combineReducers } from "redux";

import user from "./User/userReducer";
import history from "./History/historyReducer";
import videos from "./Videos/videosReducer"

const rootReducer = combineReducers({
  user: user,
  history: history,
  videos:videos
});

export default rootReducer;
