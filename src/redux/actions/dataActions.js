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

export const setViewport = (viewport) => (dispatch) => {
  dispatch({
    type: SET_VIEWPORT,
    payload: viewport,
  });
};

export const setCurrentUserPosition = (viewport) => (dispatch) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const updatedViewport = {
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 12,
      };
      dispatch(setViewport(updatedViewport));
    });
  }
};

export const setMapStyle = (mapStyleURL) => (dispatch) => {
  dispatch({
    type: SET_MAP_STYLE,
    payload: mapStyleURL,
  });
};

export const mapClick = (coords) => (dispatch) => {
  dispatch(setClick());
  dispatch(setCoords(coords));
};

export const mapUnClick = () => (dispatch) => {
  dispatch(resetClick());
  dispatch(resetCoords());
};

export const setClick = () => (dispatch) => {
  dispatch({ type: SET_CLICK });
};

export const setCoords = (coords) => (dispatch) => {
  dispatch({
    type: SET_COORDS,
    payload: coords,
  });
};

export const resetClick = () => (dispatch) => {
  dispatch({ type: RESET_CLICK });
};

export const resetCoords = () => (dispatch) => {
  dispatch({ type: RESET_COORDS });
};
