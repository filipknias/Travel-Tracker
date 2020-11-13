// Types
import {
  SET_USER,
  SET_ERROR,
  CLEAR_ERROR,
  START_USER_LOADING,
  STOP_USER_LOADING,
} from "../types";
// Firebase
import { auth } from "../../utilities/firebase";

export const signUpUser = (email, password, confirmPassword, history) => async (
  dispatch
) => {
  try {
    // Clear error
    dispatch({ type: CLEAR_ERROR });
    // Check if passwords are the same
    if (password !== confirmPassword) {
      return dispatch({
        type: SET_ERROR,
        payload: "Passwords must be the same.",
      });
    }
    // Start loading
    dispatch({ type: START_USER_LOADING });
    // Create new user
    await auth.createUserWithEmailAndPassword(email, password);
    // Set user displayName
    const newUser = auth.currentUser;
    const displayName = newUser.email.split("@")[0];
    // Update displayName and photoURL
    const photoURL = `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_STORAGE_BUCKET}/o/no-profile-image.png?alt=media&token=51b65f74-9c00-42a2-9632-bdc3134db157`;
    await newUser.updateProfile({
      displayName,
      photoURL,
    });
    // Set user state
    const userData = {
      email: newUser.email,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
    };
    dispatch({
      type: SET_USER,
      payload: userData,
    });
    // TODO: Set local storage token after creating user
    // Stop loading
    dispatch({ type: STOP_USER_LOADING });
    // Redirect to home page
    history.push("/");
  } catch (err) {
    // Set error
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
    // Stop loading
    dispatch({ type: STOP_USER_LOADING });
  }
};

export const loginUser = (email, password, history) => async (dispatch) => {
  // TODO: Set local storage token after log in
  try {
    // Clear error
    dispatch({ type: CLEAR_ERROR });
    // Start loading
    dispatch({ type: START_USER_LOADING });
    // Login user
    await auth.signInWithEmailAndPassword(email, password);
    const user = auth.currentUser;
    // Set user state
    const userData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    dispatch({
      type: SET_USER,
      payload: userData,
    });
    // Stop loading
    dispatch({ type: STOP_USER_LOADING });
    // Redirect to home page
    history.push("/");
  } catch (err) {
    // Set error
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
    // Stop loading
    dispatch({ type: STOP_USER_LOADING });
  }
};

export const clearError = () => (dispatch) => {
  // Clear error state
  dispatch({ type: CLEAR_ERROR });
};

// TODO: Make a getCurrentUser state function and call it on app starts after checking localstorage
