import React, { useState } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-map-gl";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
import PhotosIcon from "@material-ui/icons/Collections";
import StarsIcon from "@material-ui/icons/Star";
import CommentsIcon from "@material-ui/icons/Comment";
// Redux
import { connect } from "react-redux";

const useStyles = makeStyles({
  popoverContent: {
    padding: 10,
    maxWidth: 200,
    cursor: "pointer",
  },
  placeMarker: {
    fontSize: 60,
    cursor: "pointer",
  },
  placeInfoGroup: {
    display: "flex",
    marginTop: 10,
  },
  placeInfoItem: {
    display: "flex",
    alignItems: "center",
    margin: "0 5px",
    "&:nth-child(1)": {
      marginLeft: 0,
    },
    "& svg": {
      marginRight: 5,
    },
  },
});

const PlaceMarker = ({ place }) => {
  const classes = useStyles();
  // State
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  return (
    <>
      <Marker latitude={place.latitude} longitude={place.longitude}>
        <MarkerIcon
          className={classes.placeMarker}
          style={{ color: place.markerColor }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
      </Marker>
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
        <div className={classes.popoverContent}>
          <Typography variant="h6">{place.location}</Typography>
          {place.description ? (
            <Typography variant="subtitle2">{place.description}</Typography>
          ) : (
            <Typography variant="subtitle2">No description.</Typography>
          )}
          <div className={classes.placeInfoGroup}>
            <div className={classes.placeInfoItem}>
              <PhotosIcon color="inherit" />
              <Typography variant="subtitle1">{place.photos.length}</Typography>
            </div>
            {place.public && (
              <>
                <div className={classes.placeInfoItem}>
                  <CommentsIcon color="inherit" />
                  <Typography variant="subtitle1">0</Typography>
                </div>
                <div className={classes.placeInfoItem}>
                  <StarsIcon color="inherit" />
                  <Typography variant="subtitle1">0</Typography>
                </div>
              </>
            )}
          </div>
        </div>
      </Popover>
    </>
  );
};

PlaceMarker.propTypes = {
  place: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(PlaceMarker);
