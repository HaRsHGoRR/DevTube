import { LOGOUT_USER_REQUEST } from "../User/userTypes";
import {
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_REQUEST,
  FETCH_VIDEOS_FAILURE,
} from "./videosTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_VIDEOS_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case FETCH_VIDEOS_SUCCESS:
      return {
        loading: false,
        error: null,
        data: action.payload,
      };

    case LOGOUT_USER_REQUEST:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
