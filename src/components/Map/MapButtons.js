import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Components
import MapThemeDialog from "./MapThemeDialog";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
// Icons
import LocationIcon from "@material-ui/icons/GpsFixed";
import OptionsIcon from "@material-ui/icons/Settings";
// Redux
import { connect } from "react-redux";
import {
  setCurrentUserPosition,
  getPublicPlaces,
  getUserPlaces,
  getAllPlaces,
  clearPlaces,
} from "../../redux/actions/dataActions";
// Firebase
import { db } from "../../utilities/firebase";

const useStyles = makeStyles((theme) => ({
  mapBtn: {
    borderRadius: "50%",
    padding: 20,
    margin: "0 15px",
  },
  btnGroup: {
    display: "flex",
    position: "absolute",
    bottom: 50,
    right: 30,
    [theme.breakpoints.down("sm")]: {
      bottom: 30,
      right: 20,
    },
  },
  popoverHeader: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15,
  },
}));

const MapButtons = ({
  user,
  data,
  setCurrentUserPosition,
  getPublicPlaces,
  getUserPlaces,
  getAllPlaces,
  clearPlaces,
}) => {
  const classes = useStyles();
  // State
  const [anchorEl, setAnchorEl] = useState(null);
  const [publicPlaces, setPublicPlaces] = useState(true);
  const [userPlaces, setUserPlaces] = useState(true);
  const open = Boolean(anchorEl);

  const OptionsPopover = () => {
    return (
      <>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Typography variant="subtitle1" className={classes.popoverHeader}>
            Map Options
          </Typography>
          <List>
            <MapThemeDialog setAnchorEl={setAnchorEl} />
            <ListItem
              onClick={() => setPublicPlaces((publicPlaces) => !publicPlaces)}
              button
            >
              <ListItemIcon>
                <Checkbox checked={publicPlaces} />
              </ListItemIcon>
              <ListItemText primary="Public Places" />
            </ListItem>
            <ListItem
              onClick={() => setUserPlaces((userPlaces) => !userPlaces)}
              button
            >
              <ListItemIcon>
                <Checkbox checked={userPlaces} />
              </ListItemIcon>
              <ListItemText primary="My Places" />
            </ListItem>
          </List>
        </Popover>
      </>
    );
  };

  const updatePlaces = () => {
    if (user.auth && publicPlaces === true && userPlaces === true) {
      getAllPlaces(user.data.id);
    } else if (publicPlaces === false && userPlaces === false) {
      clearPlaces();
    } else if (publicPlaces === true && userPlaces === false) {
      getPublicPlaces();
    } else if (user.auth && userPlaces === true && publicPlaces === false) {
      getUserPlaces(user.data.id);
    }
  };

  useEffect(() => {
    updatePlaces();
    setAnchorEl(null);
  }, [publicPlaces, userPlaces, user.auth]);

  useEffect(() => {
    if (user.auth === false) return;
    const placesCollection = db.collection("places");
    placesCollection.onSnapshot(() => {
      updatePlaces();
    });
  }, [user.auth]);

  return (
    <div className={classes.btnGroup}>
      {user.auth && (
        <>
          <Tooltip title="Options">
            <Button
              variant="contained"
              className={classes.mapBtn}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <OptionsIcon />
            </Button>
          </Tooltip>
          <OptionsPopover />
        </>
      )}
      <Tooltip title="My Location">
        <Button
          variant="contained"
          className={classes.mapBtn}
          onClick={() => setCurrentUserPosition(data.viewport)}
        >
          <LocationIcon />
        </Button>
      </Tooltip>
    </div>
  );
};

MapButtons.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  setCurrentUserPosition: PropTypes.func.isRequired,
  getPublicPlaces: PropTypes.func.isRequired,
  getUserPlaces: PropTypes.func.isRequired,
  getAllPlaces: PropTypes.func.isRequired,
  clearPlaces: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

const mapActionsToProps = {
  setCurrentUserPosition,
  getPublicPlaces,
  getUserPlaces,
  getAllPlaces,
  clearPlaces,
};

export default connect(mapStateToProps, mapActionsToProps)(MapButtons);
