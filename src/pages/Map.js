import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapGL from "react-map-gl";
// Components
import MapButtons from "../components/Map/MapButtons";
import PlaceFormDialog from "../components/Map/PlaceFormDialog";
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

const Map = ({ data, user, setViewport, setCurrentUserPosition }) => {
  const classes = useStyles();
  // State
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [coords, setCoords] = useState(null);
  const [click, setClick] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

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

  const handleMapClick = (PointerEvent) => {
    setCoords(PointerEvent.lngLat);
    setClick(true);
  };

  const handleMapUnClick = () => {
    setClick(false);
    setCoords(null);
  };

  const handleDialogOpen = () => {
    setFormDialogOpen(true);
    setClick(false);
  };

  return (
    <>
      <ReactMapGL
        {...data.viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => setViewport(viewport)}
        mapStyle={data.mapStyle}
        onClick={handleMapClick}
        onMouseDown={handleMapUnClick}
      ></ReactMapGL>
      <MapButtons />
      {coords && (
        <>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={click}
            onClose={() => setCoords(null)}
          >
            <SnackbarContent
              classes={classes}
              message={`Lng. ${coords[0].toFixed(3)}, Lat. ${coords[1].toFixed(
                3
              )}`}
              action={
                <>
                  {user.auth && (
                    <Tooltip title="Add Place">
                      <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleDialogOpen}
                      >
                        <AddPlaceIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Close">
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={handleMapUnClick}
                      style={{ marginLeft: 5 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />
          </Snackbar>
          <PlaceFormDialog
            open={formDialogOpen}
            setOpen={setFormDialogOpen}
            coords={coords}
          />
        </>
      )}
    </>
  );
};

Map.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setViewport: PropTypes.func.isRequired,
  setCurrentUserPosition: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});

const mapActionsToProps = {
  setViewport,
  setCurrentUserPosition,
};

export default connect(mapStateToProps, mapActionsToProps)(Map);
