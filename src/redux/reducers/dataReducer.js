// Types
import {
  SET_LATITUDE,
  SET_LONGITUDE,
  SET_ZOOM,
  SET_PLACES,
  START_DATA_LOADING,
  STOP_DATA_LOADING,
} from "../types";

const initialState = {
  latitude: 40.712776,
  longitude: -74.005974,
  zoom: 10,
  places: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LATITUDE:
      return {
        ...state,
        latitude: action.payload,
      };
    case SET_LONGITUDE:
      return {
        ...state,
        longitude: action.payload,
      };
    case SET_ZOOM:
      return {
        ...state,
        zoom: action.payload,
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
  }
}
