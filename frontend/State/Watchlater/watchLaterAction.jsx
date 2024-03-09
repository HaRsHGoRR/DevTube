import axios from "axios";
import {
  FETCH_WATCHLATER_SUCCESS,
  FETCH_WATCHLATER_REQUEST,
  FETCH_WATCHLATER_FAILURE,
} from "./watchLaterTypes";

export const fetchWatchLaterRequest = () => {
  return {
    type: FETCH_WATCHLATER_REQUEST,
  };
};

export const fetchWatchLaterSuccess = (videos) => {
  return {
    type: FETCH_WATCHLATER_SUCCESS,
    payload: videos,
  };
};

export const fetchWatchLaterFailure = (error) => {
  return {
    type: FETCH_WATCHLATER_FAILURE,
    payload: error,
  };
};

export const fetchWatchLater = (user) => {
  return async (dispatch) => {
    dispatch(fetchWatchLaterRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/api/user/watch`, config);

        if (data) {
          dispatch(fetchWatchLaterSuccess(data));
        }
      } catch (error) {
        dispatch(fetchWatchLaterFailure("Couldn't load Your WatchLater."));
      }
    } else {
      dispatch(fetchWatchLaterFailure("User not exist"));
    }
  };
};

export const deleteWatchLater = (user) => {
  return async (dispatch) => {
    dispatch(fetchWatchLaterRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.delete(
          `/api/user/watch`,

          config
        );

        if (data) {
          dispatch(fetchWatchLaterSuccess(data));
        }
      } catch (error) {
        dispatch(fetchWatchLaterFailure("Couldn't delete WatchLater."));
      }
    } else {
      dispatch(fetchWatchLaterFailure("User not exist"));
    }
  };
};

export const editWatchLater = (user, id, data) => {
  return async (dispatch) => {
    dispatch(fetchWatchLaterRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(`/api/user/watch/${id}`, {}, config);

        if (data) {
          dispatch(fetchWatchLaterSuccess(data));
        }
      } catch (error) {
        dispatch(fetchWatchLaterFailure("Couldn't update WatchLater."));
      }
    } else {
      dispatch(fetchWatchLaterFailure("User not exist"));
    }
  };
};

export const addWatchLater = (user, id, data) => {
  return async (dispatch) => {
    dispatch(fetchWatchLaterRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.post(`/api/user/watch/${id}`, {}, config);

        if (data) {
          dispatch(fetchWatchLaterSuccess(data));
        }
      } catch (error) {
        dispatch(fetchWatchLaterFailure("Couldn't add video to  WatchLater."));
      }
    } else {
      dispatch(fetchWatchLaterFailure("User not exist"));
    }
  };
};
