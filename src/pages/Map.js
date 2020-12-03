import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapGL from "react-map-gl";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
// Components
import MapButtons from "../components/Map/MapButtons";
import MapPopup from "../components/Map/MapPopup";
import PlaceFormDialog from "../components/Places/PlaceFormDialog";
import PlaceDialog from "../components/Places/PlaceDialog";
import PlaceMarker from "../components/Map/PlaceMarker";
import SlideshowDialog from "../components/Places/SlideshowDialog";
// Redux
import { connect } from "react-redux";
import {
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
} from "../redux/actions/dataActions";

const useStyles = makeStyles({
  backdrop: {
    zIndex: 10,
    color: "#fff",
  },
});

const Map = ({
  data,
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
}) => {
  const classes = useStyles();
  // State
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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

  // Set current user position and get places
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
        onClick={(PointerEvent) => mapClick(PointerEvent.lngLat)}
        onMouseDown={mapUnClick}
      >
        {data.places.map((place, index) => (
          <PlaceMarker key={index} place={place} />
        ))}
      </ReactMapGL>
      <Backdrop open={data.loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MapButtons />
      <MapPopup />
      <PlaceFormDialog />
      {data.selectedPlace && (
        <>
          <PlaceDialog />
          <SlideshowDialog />
        </>
      )}
    </>
  );
};

Map.propTypes = {
  data: PropTypes.object.isRequired,
  setViewport: PropTypes.func.isRequired,
  setCurrentUserPosition: PropTypes.func.isRequired,
  mapClick: PropTypes.func.isRequired,
  mapUnClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
};

export default connect(mapStateToProps, mapActionsToProps)(Map);
