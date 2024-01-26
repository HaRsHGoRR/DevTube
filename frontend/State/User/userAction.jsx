import axios from "axios";
import {
  FETCH_USER_SUCCESS,
  FETCH_USER_REQUEST,
  FETCH_USER_FAILURE,
  LOGOUT_USER_REQUEST,
} from "./userTypes";

export const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const logoutUserRequest = () => {
  return {
    type: LOGOUT_USER_REQUEST,
  };
};

export const fetchUserSuccess = (user) => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: user,
  };
};

export const fetchUserFailure = (error) => {
  return {
    type: FETCH_USER_FAILURE,
    payload: error,
  };
};

export const fetchUser = (user) => {
  return async (dispatch) => {
    dispatch(fetchUserRequest());
    if (user) {
      try {
        const token = user.token;
        const { data } = await axios.post("/api/user/authenticate", { token });

        if (data) {
          console.log(data);

          dispatch(fetchUserSuccess(data));
        }
      } catch (error) {
        dispatch(fetchUserFailure("User not authorized"));
      }
    } else {
      dispatch(fetchUserFailure("User not exist"));
    }
  };
};

export const updateUser = ({ img, name, token }) => {
  return async (dispatch) => {
    dispatch(fetchUserRequest());

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/update",
        { img, name },
        config
      );
      if (data) {
        console.log(data);
        dispatch(fetchUserSuccess(data));
      }
    } catch (error) {
      dispatch(fetchUserFailure("Can not Update."));
    }
  };
};
