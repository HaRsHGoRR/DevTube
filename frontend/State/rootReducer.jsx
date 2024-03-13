import { combineReducers } from "redux";

import user from "./User/userReducer";
import history from "./History/historyReducer";
import videos from "./Videos/videosReducer"
import watchLater from "./Watchlater/watchLaterReducer";
import playlists from "./Playlist/playlistReducer";



const rootReducer = combineReducers({
  user: user,
  history: history,
  videos: videos,
  watchLater:watchLater,
  playlists:playlists
});

export default rootReducer;
