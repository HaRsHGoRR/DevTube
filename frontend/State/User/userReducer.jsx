import {
  FETCH_USER_SUCCESS,
  FETCH_USER_REQUEST,
  FETCH_USER_FAILURE,
  LOGOUT_USER_REQUEST,
} from "./userTypes";

const initialState = {
  data: null,
  loading: false,
  error: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_USER_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    case FETCH_USER_SUCCESS:
      return {
        loading: false,
        error: "",
        data: action.payload,
      };

    case LOGOUT_USER_REQUEST:
      return {
        loading: false,
        error: "",
        data: null,
      };

    default:
      return state;
  }
};

export default reducer;
