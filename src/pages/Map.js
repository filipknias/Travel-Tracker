import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapGL from "react-map-gl";
// Components
import MapButtons from "../components/Map/MapButtons";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import AddPlaceIcon from "@material-ui/icons/AddPhotoAlternate";
// Redux
import { connect } from "react-redux";
import {
  setViewport,
  setCurrentUserPosition,
} from "../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    marginTop: 70,
  },
}));

const Map = ({ data, setViewport, setCurrentUserPosition }) => {
  const classes = useStyles();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [click, setClick] = useState(null);
  const open = Boolean(click);

  const updateWindowSize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  // Update viewport width and height on window resize
  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);

    setViewport({
      ...data.viewport,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    return () => window.removeEventListener("resize", updateWindowSize);
  }, [windowWidth, windowHeight]);

  // Set current user position
  useEffect(() => {
    setCurrentUserPosition(data.viewport);
  }, []);

  return (
    <>
      <ReactMapGL
        {...data.viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => setViewport(viewport)}
        mapStyle={data.mapStyle}
        onClick={(PointerEvent) => setClick(PointerEvent.lngLat)}
        onMouseDown={() => setClick(null)}
      ></ReactMapGL>
      <MapButtons />
      {click && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          onClose={() => setClick(null)}
        >
          <SnackbarContent
            classes={classes}
            message={`Lng. ${click[0].toFixed(3)}, Lat. ${click[1].toFixed(3)}`}
            action={
              <>
                <Tooltip title="Add Place">
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => setClick(null)}
                  >
                    <AddPlaceIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => setClick(null)}
                    style={{ marginLeft: 5 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </>
            }
          />
        </Snackbar>
      )}
    </>
  );
};

Map.propTypes = {
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

export default connect(mapStateToProps, mapActionsToProps)(Map);
