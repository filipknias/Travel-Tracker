import React, { useState, useEffect } from "react";
import ReactMapGL from "react-map-gl";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import LocationIcon from "@material-ui/icons/GpsFixed";
import OptionsIcon from "@material-ui/icons/Settings";

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

const Map = () => {
  const classes = useStyles();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 40.712776,
    longitude: -74.005974,
    zoom: 10,
  });

  // Update viewport width and height on window resize and locate user on the map
  useEffect(() => {
    window.addEventListener("resize", (e) => {
      setViewport((prevViewport) => {
        return {
          ...prevViewport,
          width: e.currentTarget.innerWidth,
          height: e.currentTarget.innerHeight,
        };
      });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewport((prevViewport) => {
          return {
            ...prevViewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        });
      });
    }
  }, []);

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewport((prevViewport) => {
          return {
            ...prevViewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 10,
          };
        });
      });
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
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
            onClick={handleMyLocation}
          >
            <LocationIcon />
          </Button>
        </Tooltip>
      </div>
    </ReactMapGL>
  );
};

export default Map;
