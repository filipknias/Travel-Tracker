import {
  SET_USER,
  LOGOUT_USER,
  SET_ERROR,
  CLEAR_ERROR,
  START_USER_LOADING,
  STOP_USER_LOADING,
} from "../types";

const initialState = {
  data: null,
  error: null,
  auth: false,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        auth: true,
        data: {
          ...action.payload,
        },
      };
    case LOGOUT_USER:
      return {
        ...state,
        auth: false,
        data: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case START_USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_USER_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
