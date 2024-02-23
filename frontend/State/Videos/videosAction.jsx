import axios from "axios";
import {
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_REQUEST,
  FETCH_VIDEOS_FAILURE,
} from "./videosTypes";

export const fetchVideosRequest = () => {
  return {
    type: FETCH_VIDEOS_REQUEST,
  };
};

export const fetchVideosSuccess = (videos) => {
  return {
    type: FETCH_VIDEOS_SUCCESS,
    payload: videos,
  };
};

export const fetchVideosFailure = (error) => {
  return {
    type: FETCH_VIDEOS_FAILURE,
    payload: error,
  };
};

export const fetchVideos = (user) => {
  return async (dispatch) => {
    dispatch(fetchVideosRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get("/api/video", config);

        if (data) {
          dispatch(fetchVideosSuccess(data));
        }
      } catch (error) {
        dispatch(fetchVideosFailure("Couldn't load Your Videos."));
      }
    } else {
      dispatch(fetchVideosFailure("User not exist"));
    }
  };
};

export const deleteVideo = (user, id) => {
  return async (dispatch) => {
    dispatch(fetchVideosRequest());
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
          `/api/video/delete/${id}`,

          config
        );

        if (data) {
          dispatch(fetchVideosSuccess(data));
        }
      } catch (error) {
        dispatch(fetchVideosFailure("Couldn't delete Videos."));
      }
    } else {
      dispatch(fetchVideosFailure("User not exist"));
    }
  };
};

export const editVideo = (user, id, data) => {
  return async (dispatch) => {
    dispatch(fetchVideosRequest());
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
          `/api/video/update/${id}`,

          config
        );

        if (data) {
          dispatch(fetchVideosSuccess(data));
        }
      } catch (error) {
        dispatch(fetchVideosFailure("Couldn't update Video."));
      }
    } else {
      dispatch(fetchVideosFailure("User not exist"));
    }
  };
};
