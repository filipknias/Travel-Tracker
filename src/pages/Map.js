import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapGL, { Marker } from "react-map-gl";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
// Components
import MapButtons from "../components/Map/MapButtons";
import MapPopup from "../components/Map/MapPopup";
import PlaceFormDialog from "../components/Dialogs/PlaceFormDialog";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
// Redux
import { connect } from "react-redux";
import {
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
  getPublicPlaces,
} from "../redux/actions/dataActions";

const useStyles = makeStyles({
  backdrop: {
    zIndex: 10,
    color: "#fff",
  },
  placeMarker: {
    fontSize: 50,
    cursor: "pointer",
  },
});

const Map = ({
  data,
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
  getPublicPlaces,
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
    const placesSetup = async () => {
      await getPublicPlaces();
    };
    setCurrentUserPosition(data.viewport);
    placesSetup();
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
        {data.places.map((place) => (
          <Marker latitude={place.latitude} longitude={place.longitude}>
            <MarkerIcon
              className={classes.placeMarker}
              style={{ color: place.markerColor }}
            />
          </Marker>
        ))}
      </ReactMapGL>
      <Backdrop open={data.loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MapButtons />
      <MapPopup />
      <PlaceFormDialog />
    </>
  );
};

Map.propTypes = {
  data: PropTypes.object.isRequired,
  setViewport: PropTypes.func.isRequired,
  setCurrentUserPosition: PropTypes.func.isRequired,
  mapClick: PropTypes.func.isRequired,
  mapUnClick: PropTypes.func.isRequired,
  getPublicPlaces: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
  getPublicPlaces,
};

export default connect(mapStateToProps, mapActionsToProps)(Map);
