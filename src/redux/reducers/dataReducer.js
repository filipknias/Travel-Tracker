// Types
import {
  SET_VIEWPORT,
  SET_SELECTED_PLACE,
  SET_PLACES,
  START_DATA_LOADING,
  STOP_DATA_LOADING,
} from "../types";

const initialState = {
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 40.73,
    longitude: -73.93,
    zoom: 10,
  },
  selectedPlace: null,
  places: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VIEWPORT:
      return {
        ...state,
        viewport: {
          ...action.payload,
        },
      };
    case SET_SELECTED_PLACE:
      return {
        ...state,
        selectedPlace: action.payload,
      };
    case SET_PLACES:
      return {
        ...state,
        places: [...action.payload],
      };
    case START_DATA_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_DATA_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
