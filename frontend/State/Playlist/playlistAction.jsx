import axios from "axios";
import {
  FETCH_PLAYLISTS_SUCCESS,
  FETCH_PLAYLISTS_REQUEST,
  UPDATE_TO_PLAYLIST_FAILURE,
  UPDATE_TO_PLAYLIST_SUCCESS,
  FETCH_PLAYLISTS_FAILURE,
} from "./playlistTypes";

export const fetchPlaylistsRequest = () => {
  return {
    type: FETCH_PLAYLISTS_REQUEST,
  };
};

export const fetchPlaylistsSuccess = (playlists) => {
  return {
    type: FETCH_PLAYLISTS_SUCCESS,
    payload: playlists,
  };
};

export const fetchPlaylistsFailure = (error) => {
  return {
    type: FETCH_PLAYLISTS_FAILURE,
    payload: error,
  };
};

export const updateToPlaylistFailure = (error) => {
  return {
    type: UPDATE_TO_PLAYLIST_FAILURE,
    payload: error,
  };
};

export const updateToPlaylist = (playlist) => {
  return {
    type: UPDATE_TO_PLAYLIST_SUCCESS,
    payload: playlist,
  };
};

export const fetchPlaylists = (user) => {
  return async (dispatch) => {
    dispatch(fetchPlaylistsRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get("/api/playlist", config);

        if (data) {
          dispatch(fetchPlaylistsSuccess(data));
        }
      } catch (error) {
        dispatch(fetchPlaylistsFailure("Couldn't load Playlists."));
      }
    } else {
      dispatch(fetchPlaylistsFailure("User not exist"));
    }
  };
};

export const deletePlaylist = (user, id) => {
  return async (dispatch) => {
    dispatch(fetchPlaylistsRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.delete(`/api/playlist/${id}`, config);

        if (data) {
          dispatch(fetchPlaylistsSuccess(data));
        }
      } catch (error) {
        dispatch(fetchPlaylistsFailure("Couldn't delete Playlist."));
      }
    } else {
      dispatch(fetchPlaylistsFailure("User not exist"));
    }
  };
};

export const createPlaylist = (user, playlist) => {
  return async (dispatch) => {
    dispatch(fetchPlaylistsRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.post(`/api/playlist`, playlist, config);

        if (data) {
          dispatch(fetchPlaylistsSuccess(data));
        }
      } catch (error) {
        dispatch(fetchPlaylistsFailure("Couldn't create Playlist."));
      }
    } else {
      dispatch(fetchPlaylistsFailure("User not exist"));
    }
  };
};

export const updatePlaylist = (user, playlist, id) => {
  return async (dispatch) => {
    dispatch(fetchPlaylistsRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `/api/playlist/${id}`,
          playlist,
          config
        );

        if (data) {
          dispatch(fetchPlaylistsSuccess(data));
        }
      } catch (error) {
        dispatch(fetchPlaylistsFailure("Couldn't update Playlist."));
      }
    } else {
      dispatch(fetchPlaylistsFailure("User not exist"));
    }
  };
};

export const addToPlayList = (user, videoId, playlistId) => {
  return async (dispatch) => {
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `/api/playlist/add/${playlistId}`,
          { videoId: videoId },
          config
        );

        if (data) {
          dispatch(updateToPlaylist(data));
        }
      } catch (error) {
        dispatch(updateToPlaylistFailure("Couldn't add Video to playlist."));
      }
    } else {
      dispatch(fetchPlaylistsFailure("User not exist"));
    }
  };
};

export const removeFromPlayList = (user, videoId, playlistId) => {
  return async (dispatch) => {
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `/api/playlist/remove/${playlistId}`,
          { videoId: videoId },
          config
        );

        if (data) {
          dispatch(updateToPlaylist(data));
        }
      } catch (error) {
        dispatch(updateToPlaylistFailure("Couldn't remove Video to playlist."));
      }
    } else {
      dispatch(fetchPlaylistsFailure("User not exist"));
    }
  };
};
