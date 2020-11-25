import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapGL from "react-map-gl";
// Components
import MapButtons from "../components/Map/MapButtons";
import MapPopup from "../components/Map/MapPopup";
// Redux
import { connect } from "react-redux";
import {
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
} from "../redux/actions/dataActions";

const Map = ({
  data,
  setViewport,
  setCurrentUserPosition,
  mapClick,
  mapUnClick,
}) => {
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
        onClick={(PointerEvent) => mapClick(PointerEvent.lngLat)}
        onMouseDown={mapUnClick}
      ></ReactMapGL>
      <MapButtons />
      <MapPopup />
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
