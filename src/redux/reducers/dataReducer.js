// Types
import {
  SET_VIEWPORT,
  SET_SELECTED_PLACE,
  SET_PLACES,
  SET_CLICK,
  RESET_CLICK,
  SET_COORDS,
  RESET_COORDS,
  SET_MAP_STYLE,
  START_DATA_LOADING,
  STOP_DATA_LOADING,
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
    case SET_CLICK:
      return {
        ...state,
        click: true,
      };
    case RESET_CLICK:
      return {
        ...state,
        click: false,
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
    case SET_MAP_STYLE:
      return {
        ...state,
        mapStyle: action.payload,
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
