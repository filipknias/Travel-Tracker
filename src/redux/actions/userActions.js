// Types
import {
  SET_USER,
  LOGOUT_USER,
  SET_ERROR,
  CLEAR_ERROR,
  START_LOADING,
  STOP_LOADING,
} from "../types";
// Firebase
import { auth } from "../../utilities/firebase";

export const signUpUser = (email, password, confirmPassword, history) => async (
  dispatch
) => {
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
  dispatch({ type: START_LOADING });
  try {
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
    // Set updated user state
    dispatch(setCurrentUser());
    // Redirect to home page
    history.push("/");
  } catch (err) {
    // Set error
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
  }
  // Stop loading
  dispatch({ type: STOP_LOADING });
};

export const loginUser = (email, password, history) => async (dispatch) => {
  // Clear error
  dispatch({ type: CLEAR_ERROR });
  // Start loading
  dispatch({ type: START_LOADING });
  try {
    // Login user
    await auth.signInWithEmailAndPassword(email, password);
    // Redirect to home page
    history.push("/");
  } catch (err) {
    // Set error
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
  }
  // Stop loading
  dispatch({ type: STOP_LOADING });
};

export const setCurrentUser = () => async (dispatch) => {
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
};

export const logoutUser = () => (dispatch) => {
  auth.signOut();
  dispatch({ type: LOGOUT_USER });
};

export const changeUserPassword = (email, history) => async (dispatch) => {
  // Clear error
  dispatch({ type: CLEAR_ERROR });
  // Start loading
  dispatch({ type: START_LOADING });
  try {
    // Send email with reset password
    await auth.sendPasswordResetEmail(email);
    // Stop loading
    dispatch({ type: STOP_LOADING });
    // Redirect to login page
    history.push("/login");
  } catch (err) {
    // Set error
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
  }
  // Stop loading
  dispatch({ type: STOP_LOADING });
};

export const clearError = () => (dispatch) => {
  // Clear error state
  dispatch({ type: CLEAR_ERROR });
};
