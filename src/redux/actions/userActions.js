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
    await newUser.updateProfile({
      displayName,
      photoURL: "gs://travel-tracker-fc10f.appspot.com/no-profile-image.png",
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
