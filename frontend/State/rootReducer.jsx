import { combineReducers } from "redux";

import user from "./User/userReducer";
import history from "./History/historyReducer";
import videos from "./Videos/videosReducer"
import watchLater from "./Watchlater/watchLaterReducer";


const rootReducer = combineReducers({
  user: user,
  history: history,
  videos: videos,
  watchLater:watchLater
});

export default rootReducer;
