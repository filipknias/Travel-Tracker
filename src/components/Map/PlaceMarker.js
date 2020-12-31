import React, { useState } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-map-gl";
// Components
import PlaceDialog from "../Places/PlaceDialog";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
import PhotosIcon from "@material-ui/icons/Collections";
import StarsIcon from "@material-ui/icons/Star";
import CommentsIcon from "@material-ui/icons/Comment";

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
          <div className={classes.popoverHeaderGroup}>
            <Typography variant="h6">{place.location}</Typography>
            <PlaceDialog place={place} />
          </div>
          {place.description ? (
            <Typography variant="subtitle2">{place.description}</Typography>
          ) : (
            <Typography variant="subtitle2">No description</Typography>
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
                  <Typography variant="subtitle1">
                    {place.ratingAvg.toFixed(1)}
                  </Typography>
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

export default PlaceMarker;
