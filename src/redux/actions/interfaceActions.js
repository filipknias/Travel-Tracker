// Types
import {
  SET_PLACE_FORM_DIALOG_OPEN,
  SET_PROFILE_DIALOG_OPEN,
  SET_PLACE_DIALOG_OPEN,
  SET_MAP_THEME_DIALOG_OPEN,
} from "../types";

export const setPlaceFormDialogOpen = (open) => (dispatch) => {
  dispatch({
    type: SET_PLACE_FORM_DIALOG_OPEN,
    payload: open,
  });
};

export const setProfileDialogOpen = (open) => (dispatch) => {
  dispatch({
    type: SET_PROFILE_DIALOG_OPEN,
    payload: open,
  });
};

export const setPlaceDialogOpen = (open) => (dispatch) => {
  dispatch({
    type: SET_PLACE_DIALOG_OPEN,
    payload: open,
  });
};

export const setMapThemeDialogOpen = (open) => (dispatch) => {
  dispatch({
    type: SET_MAP_THEME_DIALOG_OPEN,
    payload: open,
  });
};
