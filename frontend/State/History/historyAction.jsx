import axios from "axios";
import {
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_REQUEST,
  FETCH_HISTORY_FAILURE,
} from "./historyTypes";

export const fetchHistoryRequest = () => {
  return {
    type: FETCH_HISTORY_REQUEST,
  };
};

export const fetchHistorySuccess = (history) => {
  return {
    type: FETCH_HISTORY_SUCCESS,
    payload: history,
  };
};

export const fetchHistoryFailure = (error) => {
  return {
    type: FETCH_HISTORY_FAILURE,
    payload: error,
  };
};

export const fetchHistory = (user) => {
  return async (dispatch) => {
    dispatch(fetchHistoryRequest());
    if (user) {
      try {
        const token = user.token;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get("/api/user/history", config);

        if (data) {
          // here have to set user history and watch later
          dispatch(fetchHistorySuccess(data));
        }
      } catch (error) {
        dispatch(fetchHistoryFailure("Couldn't load History."));
      }
    } else {
      dispatch(fetchHistoryFailure("User not exist"));
    }
  };
};
