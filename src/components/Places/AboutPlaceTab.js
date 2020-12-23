import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Components
import PlaceFormDialog from "./PlaceFormDialog";
import SlideshowDialog from "./SlideshowDialog";
import DeletePlaceDialog from "./DeletePlaceDialog";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import EditIcon from "@material-ui/icons/Create";
// Redux
import { connect } from "react-redux";
import { setSelectedPlace, deletePlace } from "../../redux/actions/dataActions";
// Firebase
import { db } from "../../utilities/firebase";

const useStyles = makeStyles({
  dialogTitle: {
    padding: 0,
    marginBottom: 20,
  },
  placeInfoGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  photosGroup: {
    margin: "10px 0",
  },
  photo: {
    width: "100%",
    margin: "10px 0",
    objectFit: "cover",
    borderRadius: 5,
  },
});

const AboutPlaceTab = ({ user, data, setSelectedPlace, deletePlace }) => {
  const classes = useStyles();
  // State
  const [formOpen, setFormOpen] = useState(false);

  const formatVisitDate = () => {
    const dateToFormat = data.selectedPlace.visitDate;
    const dateString = dateToFormat.toDate().toDateString();
    const formattedDate = dateString.substr(4, dateString.length);
    return formattedDate;
  };

  useEffect(() => {
    const placeDoc = db.collection("places").doc(data.selectedPlace.id);

    placeDoc.onSnapshot((doc) => {
      if (doc.data()) {
        setSelectedPlace({
          id: doc.id,
          ...doc.data(),
        });
      }
    });
  }, []);

  return (
    <>
      <div className={classes.placeInfoGroup}>
        <div>
          <Typography variant="subtitle2">
            Visit Date: {formatVisitDate()}
          </Typography>
          <Typography variant="h5">{data.selectedPlace.location}</Typography>
          <div style={{ marginTop: 5 }}>
            {data.selectedPlace.description ? (
              <Typography variant="body1">
                {data.selectedPlace.description}
              </Typography>
            ) : (
              <Typography variant="body1">No description</Typography>
            )}
          </div>
        </div>
        {user.auth && user.data.id === data.selectedPlace.userId && (
          <div>
            <Tooltip title="Edit">
              <IconButton onClick={() => setFormOpen(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <DeletePlaceDialog />
            <PlaceFormDialog open={formOpen} setOpen={setFormOpen} />
          </div>
        )}
      </div>
      <div className={classes.photosGroup}>
        {data.selectedPlace.photos.length > 1 && <SlideshowDialog />}
        {data.selectedPlace.photos.map((photo, index) => (
          <img
            className={classes.photo}
            src={photo.url}
            alt={photo.url}
            key={index}
            height="300"
          />
        ))}
      </div>
    </>
  );
};

AboutPlaceTab.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  setSelectedPlace: PropTypes.func.isRequired,
  deletePlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

const mapActionsToProps = {
  setSelectedPlace,
  deletePlace,
};

export default connect(mapStateToProps, mapActionsToProps)(AboutPlaceTab);
