import React, { useEffect } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import EditIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
// Redux
import { connect } from "react-redux";
import { setSelectedPlace } from "../../redux/actions/dataActions";
import {
  setSlideshowDialogOpen,
  setPlaceFormDialogOpen,
} from "../../redux/actions/interfaceActions";
// Firebase
import { db, auth } from "../../utilities/firebase";

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
  slideshowBtn: {
    marginLeft: "auto",
    display: "block",
  },
});

const AboutPlaceTab = ({
  user,
  data,
  setSlideshowDialogOpen,
  setPlaceFormDialogOpen,
  setSelectedPlace,
}) => {
  const classes = useStyles();

  const formatVisitDate = () => {
    const dateToFormat = data.selectedPlace.visitDate;
    const dateString = dateToFormat.toDate().toDateString();
    const formattedDate = dateString.substr(4, dateString.length);
    return formattedDate;
  };

  useEffect(() => {
    const placeDoc = db.collection("places").doc(data.selectedPlace.id);

    placeDoc.onSnapshot((doc) => {
      setSelectedPlace({
        id: doc.id,
        ...doc.data(),
      });
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
        {user.auth && auth.currentUser.uid === data.selectedPlace.userId && (
          <div>
            <Tooltip title="Edit">
              <IconButton onClick={() => setPlaceFormDialogOpen(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
      <div className={classes.photosGroup}>
        {data.selectedPlace.photos.length > 1 && (
          <Button
            color="primary"
            className={classes.slideshowBtn}
            onClick={() => setSlideshowDialogOpen(true)}
          >
            Slideshow
          </Button>
        )}
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
  setSlideshowDialogOpen: PropTypes.func.isRequired,
  setPlaceFormDialogOpen: PropTypes.func.isRequired,
  setSelectedPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
  dialogOpen: state.interface.dialogsOpen.selectedPlace,
});

const mapActionsToProps = {
  setSlideshowDialogOpen,
  setPlaceFormDialogOpen,
  setSelectedPlace,
};

export default connect(mapStateToProps, mapActionsToProps)(AboutPlaceTab);
