import React, { useState, useEffect } from "react";
import ReactMapGL from "react-map-gl";

const Map = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 10,
  });

  // Add window event listener on resize to update viewport width and height
  // Locate user on the map
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
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {/* Map content */}
    </ReactMapGL>
  );
};

export default Map;
