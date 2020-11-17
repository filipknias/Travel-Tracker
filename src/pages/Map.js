import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMapGL from "react-map-gl";
// Components
import MapButtons from "../components/Map/MapButtons";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
// Redux
import { connect } from "react-redux";
import {
  setViewport,
  setCurrentUserPosition,
} from "../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({}));

const Map = ({ data, setViewport, setCurrentUserPosition }) => {
  const classes = useStyles();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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

  const updateWindowSize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    setCurrentUserPosition(data.viewport);
  }, []);

  return (
    <ReactMapGL
      {...data.viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      <MapButtons />
    </ReactMapGL>
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
