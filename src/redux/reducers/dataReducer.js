// Types
import {
  SET_VIEWPORT,
  SET_SELECTED_PLACE,
  CLEAR_SELECTED_PLACE,
  SET_PLACES,
  CLEAR_PLACES,
  SET_CLICK,
  SET_COORDS,
  RESET_COORDS,
  SET_MAP_STYLE,
  SET_ERROR,
  CLEAR_ERROR,
  START_LOADING,
  STOP_LOADING,
} from "../types";

const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/streets-v11";
const mapStyle =
  localStorage.getItem("TRAVEL-TRACKER-MAP-STYLE") || DEFAULT_MAP_STYLE;

const initialState = {
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 40.73,
    longitude: -73.93,
    zoom: 10,
  },
  mapStyle,
  click: false,
  coords: null,
  selectedPlace: null,
  error: null,
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
    case CLEAR_SELECTED_PLACE:
      return {
        ...state,
        selectedPlace: null,
      };
    case SET_CLICK:
      return {
        ...state,
        click: action.payload,
      };
    case SET_COORDS:
      return {
        ...state,
        coords: action.payload,
      };
    case RESET_COORDS:
      return {
        ...state,
        coords: null,
      };
    case SET_PLACES:
      return {
        ...state,
        places: [...action.payload],
      };
    case CLEAR_PLACES:
      return {
        ...state,
        places: [],
      };
    case SET_MAP_STYLE:
      return {
        ...state,
        mapStyle: action.payload,
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
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
