import { LOGOUT_USER_REQUEST } from "../User/userTypes";
import {
  FETCH_PLAYLISTS_SUCCESS,
  FETCH_PLAYLISTS_REQUEST,
  FETCH_PLAYLISTS_FAILURE,
  UPDATE_TO_PLAYLIST_FAILURE,
  UPDATE_TO_PLAYLIST_SUCCESS,
  
} from "./playlistTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLAYLISTS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_PLAYLISTS_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case FETCH_PLAYLISTS_SUCCESS:
      return {
        loading: false,
        error: null,
        data: action.payload,
      };

    case UPDATE_TO_PLAYLIST_SUCCESS:
      const updatedPlaylist = action.payload;

      const filteredPlaylists = state.data.filter(
        (playlist) => playlist._id !== updatedPlaylist._id
      );

      return {
        loading: false,
        error: null,
        data: [updatedPlaylist, ...filteredPlaylists],
      };

    case UPDATE_TO_PLAYLIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        
      };

    case LOGOUT_USER_REQUEST:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
