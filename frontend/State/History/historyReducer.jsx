import { LOGOUT_USER_REQUEST } from "../User/userTypes";
import {
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_REQUEST,
  FETCH_HISTORY_FAILURE,
} from "./historyTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_HISTORY_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case FETCH_HISTORY_SUCCESS:
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
