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
// Firebase
import firebase from "firebase/app";
import { storage, db, auth } from "../../utilities/firebase";
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

export const setSelectedPlace = (place) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_PLACE,
    payload: place,
  });
};

export const clearSelectedPlace = () => (dispatch) => {
  dispatch({ type: CLEAR_SELECTED_PLACE });
};

export const mapClick = (coords) => (dispatch) => {
  dispatch(setClick(true));
  dispatch(setCoords(coords));
};

export const mapUnClick = () => (dispatch) => {
  dispatch(setClick(false));
  dispatch(resetCoords());
};

export const setClick = (click) => (dispatch) => {
  dispatch({
    type: SET_CLICK,
    payload: click,
  });
};

export const setCoords = (coords) => (dispatch) => {
  dispatch({
    type: SET_COORDS,
    payload: coords,
  });
};

export const resetCoords = () => (dispatch) => {
  dispatch({ type: RESET_COORDS });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};

const isLocationUnique = async (location) => {
  const placesRef = db.collection("places");
  const foundPlaces = [];
  const query = placesRef
    .where("location", "==", location)
    .where("public", "==", true);
  const docs = await query.get();
  docs.forEach((doc) => {
    foundPlaces.push(doc.data());
  });
  if (foundPlaces.length > 0) {
    return false;
  } else {
    return true;
  }
};

export const addPlace = (
  longitude,
  latitude,
  location,
  description,
  markerColor,
  photosFiles,
  publicStatus,
  visitDate
) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  dispatch({ type: CLEAR_ERROR });

  try {
    if (location.trim() === "") return "";

    // Check if location with this name exist when location is public
    if (publicStatus === true) {
      if ((await isLocationUnique(location)) === false) {
        dispatch({
          type: SET_ERROR,
          payload: "Place with this location arleady exist",
        });
        return dispatch({ type: STOP_LOADING });
      }
    }

    // Sort photos to jpeg/png files
    const photosFilesFormatted = photosFiles.filter((photoFile) => {
      return photoFile.type === "image/jpeg" || photoFile.type === "image/png";
    });

    // Save photos in storage
    const photosUrls = photosFilesFormatted.map(async (photo) => {
      const storageRef = storage.ref();
      const fileName = uuid();
      const fileRef = storageRef.child(fileName);
      await fileRef.put(photo);
      const fileUrl = await fileRef.getDownloadURL();
      return {
        fileName,
        url: fileUrl,
      };
    });
    const photosObject = await Promise.all(photosUrls);

    // Save location
    const placesRef = db.collection("places");
    const createdPlace = {
      longitude,
      latitude,
      location,
      markerColor,
      photos: photosObject,
      public: publicStatus,
      visitDate,
      userId: auth.currentUser.uid,
      commentCount: 0,
      ratingAvg: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    if (description && description.trim() !== "") {
      createdPlace.description = description;
    }
    await placesRef.add(createdPlace);
  } catch {
    dispatch({
      type: SET_ERROR,
      payload: "Somethink went wrong. Please try again",
    });
  }

  dispatch({ type: STOP_LOADING });
};

export const editPlace = (
  placeId,
  prevLocation,
  location,
  description,
  markerColor,
  prevPhotos,
  photosFiles,
  publicStatus,
  visitDate
) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  dispatch({ type: CLEAR_ERROR });
  try {
    if (location.trim() === "") return;

    // Check if location with this name exist when location is public
    if (publicStatus === true && prevLocation !== location) {
      if ((await isLocationUnique(location)) === false) {
        dispatch({
          type: SET_ERROR,
          payload: "Place with this location arleady exist",
        });
        return dispatch({ type: STOP_LOADING });
      }
    }

    // Delete all previous photos from location
    const storageRef = storage.ref();
    prevPhotos.forEach(async (photo) => {
      await storageRef.child(photo.fileName).delete();
    });

    // Sort photos to jpeg/png files
    const photosFilesFormatted = photosFiles.filter((photoFile) => {
      return photoFile.type === "image/jpeg" || photoFile.type === "image/png";
    });

    // Save photos in storage
    const photosUrls = await photosFilesFormatted.map(async (photo) => {
      const fileName = uuid();
      const fileRef = storageRef.child(fileName);
      await fileRef.put(photo);
      const fileUrl = await fileRef.getDownloadURL();
      return {
        fileName,
        url: fileUrl,
      };
    });
    const photosObjects = await Promise.all(photosUrls);

    // Save location
    const placeDocRef = db.collection("places").doc(placeId);
    const updatedPlace = {
      location,
      markerColor,
      photos: photosObjects,
      public: publicStatus,
      visitDate,
    };
    if (description && description.trim() !== "") {
      updatedPlace.description = description;
    }

    await placeDocRef.update(updatedPlace);
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_ERROR,
      payload: "Somethink went wrong. Please try again",
    });
  }

  dispatch({ type: STOP_LOADING });
};

export const getPublicPlaces = () => async (dispatch) => {
  dispatch({ type: START_LOADING });

  const publicPlaces = [];
  const placesRef = db.collection("places");
  const query = placesRef
    .where("public", "==", true)
    .where("userId", "!=", auth.currentUser.uid);
  const docs = await query.get();
  docs.forEach((doc) => {
    publicPlaces.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  dispatch({
    type: SET_PLACES,
    payload: publicPlaces,
  });

  dispatch({ type: STOP_LOADING });
};

export const getUserPlaces = (userId) => async (dispatch) => {
  dispatch({ type: START_LOADING });

  const userPlaces = [];
  const placesRef = db.collection("places");
  const query = placesRef.where("userId", "==", userId);
  const docs = await query.get();
  docs.forEach((doc) => {
    userPlaces.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  dispatch({
    type: SET_PLACES,
    payload: userPlaces,
  });

  dispatch({ type: STOP_LOADING });
};

export const getAllPlaces = () => async (dispatch) => {
  dispatch({ type: START_LOADING });

  const places = [];
  const placesRef = db.collection("places");
  const query = placesRef.orderBy("createdAt").limit(100);
  const docs = await query.get();
  docs.forEach((doc) => {
    places.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  dispatch({
    type: SET_PLACES,
    payload: places,
  });

  dispatch({ type: STOP_LOADING });
};

export const clearPlaces = () => (dispatch) => {
  dispatch({ type: CLEAR_PLACES });
};

export const ratePlace = (rate, comment, placeId, userData) => async (
  dispatch
) => {
  dispatch({ type: START_LOADING });
  try {
    const ratingsRef = db.collection("ratings");
    await ratingsRef.add({
      placeId,
      user: userData,
      rate,
      comment,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_ERROR,
      payload: "Somethink went wrong. Please try again",
    });
  }
  dispatch({ type: STOP_LOADING });
};
