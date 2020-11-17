import React from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import LocationIcon from "@material-ui/icons/GpsFixed";
import OptionsIcon from "@material-ui/icons/Settings";
// Redux
import { connect } from "react-redux";
import {
  setViewport,
  setCurrentUserPosition,
} from "../../redux/actions/dataActions";

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
}));

const MapButtons = ({ data, setViewport, setCurrentUserPosition }) => {
  const classes = useStyles();

  const handleMyLocationClick = () => {
    setViewport({
      ...data.viewport,
      zoom: 10,
    });
    setCurrentUserPosition(data.viewport);
  };

  return (
    <div className={classes.btnGroup}>
      <Tooltip title="Options">
        <Button variant="contained" className={classes.mapBtn}>
          <OptionsIcon />
        </Button>
      </Tooltip>
      <Tooltip title="My Location">
        <Button
          variant="contained"
          className={classes.mapBtn}
          onClick={handleMyLocationClick}
        >
          <LocationIcon />
        </Button>
      </Tooltip>
    </div>
  );
};

MapButtons.propTypes = {
  data: PropTypes.object.isRequired,
  setViewport: PropTypes.func.isRequired,
  setCurrentUserPosition: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  setViewport,
  setCurrentUserPosition,
};

export default connect(mapStateToProps, mapActionsToProps)(MapButtons);
