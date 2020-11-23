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
// Firebase
import { storage, db } from "../../utilities/firebase";
import { v4 as uuid } from "uuid";

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

export const addPlace = (
  longitude,
  latitude,
  location,
  description,
  markerColor,
  photosFiles,
  publicStatus
) => async (dispatch) => {
  dispatch({ type: START_DATA_LOADING });

  if (location.trim() === "") return;

  const photosUrls = photosFiles.map(async (photo) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(uuid());
    await fileRef.put(photo);
    const fileUrl = await fileRef.getDownloadURL();
    return fileUrl;
  });
  const photoUrlsPromisesResolved = await Promise.all(photosUrls);

  const placesRef = db.collection("places");
  const createdPlace = {
    longitude,
    latitude,
    location,
    markerColor,
    photos: photoUrlsPromisesResolved,
    public: publicStatus,
    createdAt: Date.now(),
  };
  if (description.trim() !== "") {
    createdPlace.description = description;
  }
  await placesRef.add(createdPlace);

  dispatch({ type: STOP_DATA_LOADING });
};
