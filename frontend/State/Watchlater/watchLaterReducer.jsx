import { LOGOUT_USER_REQUEST } from "../User/userTypes";
import {
  FETCH_WATCHLATER_SUCCESS,
  FETCH_WATCHLATER_REQUEST,
  FETCH_WATCHLATER_FAILURE,
} from "./watchLaterTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WATCHLATER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_WATCHLATER_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case FETCH_WATCHLATER_SUCCESS:
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
