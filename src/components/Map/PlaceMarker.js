import React, { useState } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-map-gl";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
import PhotosIcon from "@material-ui/icons/Collections";
import StarsIcon from "@material-ui/icons/Star";
import CommentsIcon from "@material-ui/icons/Comment";
import OpenDialogIcon from "@material-ui/icons/Launch";
// Redux
import { connect } from "react-redux";
import {
  setSelectedPlace,
  clearSelectedPlace,
} from "../../redux/actions/dataActions";
import { setPlaceDialogOpen } from "../../redux/actions/interfaceActions";

const useStyles = makeStyles({
  popoverContent: {
    padding: 10,
    maxWidth: 400,
  },
  popoverHeaderGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeMarker: {
    fontSize: 60,
    cursor: "pointer",
  },
  photoPreview: {
    margin: "10px auto 5px auto",
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

const PlaceMarker = ({
  place,
  setSelectedPlace,
  clearSelectedPlace,
  setPlaceDialogOpen,
}) => {
  const classes = useStyles();
  // State
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  const handlePopoverClose = () => {
    setAnchorEl(null);
    clearSelectedPlace();
  };

  const handleDialogOpen = () => {
    setPlaceDialogOpen(true);
    setAnchorEl(null);
  };

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
        onEnter={() => setSelectedPlace(place)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
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
          <div className={classes.popoverHeaderGroup}>
            <Typography variant="h6">{place.location}</Typography>
            <Tooltip title="Open Place">
              <IconButton onClick={handleDialogOpen}>
                <OpenDialogIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          {place.description ? (
            <Typography variant="subtitle2">{place.description}</Typography>
          ) : (
            <Typography variant="subtitle2">No description.</Typography>
          )}
          {place.photos.length > 0 && (
            <img
              src={place.photos[0].url}
              alt={place.photos[0].url}
              height="150"
              className={classes.photoPreview}
            />
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
                  <Typography variant="subtitle1">
                    {place.commentCount}
                  </Typography>
                </div>
                <div className={classes.placeInfoItem}>
                  <StarsIcon color="inherit" />
                  <Typography variant="subtitle1">{place.ratingAvg}</Typography>
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
  setSelectedPlace: PropTypes.func.isRequired,
  clearSelectedPlace: PropTypes.func.isRequired,
  setPlaceDialogOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  setSelectedPlace,
  clearSelectedPlace,
  setPlaceDialogOpen,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceMarker);
