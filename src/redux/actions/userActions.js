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
// Material UI
import {
  orange,
  purple,
  green,
  blue,
  blueGrey,
} from "@material-ui/core/colors";

export const signUpUser = (email, password, confirmPassword, history) => async (
  dispatch
) => {
  dispatch({ type: CLEAR_ERROR });
  dispatch({ type: START_LOADING });

  try {
    if (password !== confirmPassword) {
      return dispatch({
        type: SET_ERROR,
        payload: "Passwords must be the same.",
      });
    }

    await auth.createUserWithEmailAndPassword(email, password);
    const newUser = auth.currentUser;
    const displayName = newUser.email.split("@")[0];

    const AVATAR_COLORS = [
      orange[900],
      purple[900],
      green[900],
      blue[900],
      blueGrey[900],
    ];
    const randomColor = Math.floor(Math.random() * AVATAR_COLORS.length);

    await newUser.updateProfile({
      displayName,
      photoURL: AVATAR_COLORS[randomColor],
    });

    dispatch(setCurrentUser());
    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
  }
  dispatch({ type: STOP_LOADING });
};

export const loginUser = (email, password, history) => async (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
  dispatch({ type: START_LOADING });

  try {
    await auth.signInWithEmailAndPassword(email, password);
    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
  }
  dispatch({ type: STOP_LOADING });
};

export const setCurrentUser = () => async (dispatch) => {
  const user = auth.currentUser;

  const userData = {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
    avatarColor: user.photoURL,
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
  dispatch({ type: CLEAR_ERROR });
  dispatch({ type: START_LOADING });
  try {
    await auth.sendPasswordResetEmail(email);
    history.push("/login");
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.message,
    });
  }
  dispatch({ type: STOP_LOADING });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};
