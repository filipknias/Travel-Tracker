import React, { useState } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import EditIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
// Redux
import { connect } from "react-redux";
import { clearSelectedPlace } from "../../redux/actions/dataActions";
import {
  setPlaceDialogOpen,
  setSlideshowDialogOpen,
  setPlaceFormDialogOpen,
} from "../../redux/actions/interfaceActions";
// Firebase
import { auth } from "../../utilities/firebase";

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

const PlaceDialog = ({
  data,
  dialogOpen,
  setPlaceDialogOpen,
  setSlideshowDialogOpen,
  clearSelectedPlace,
  setPlaceFormDialogOpen,
}) => {
  const classes = useStyles();
  // State
  const [selectedTab, setSelectedTab] = useState(0);

  const handleDialogClose = () => {
    setPlaceDialogOpen(false);
    clearSelectedPlace();
  };

  const formatVisitDate = () => {
    const dateToFormat = data.selectedPlace.visitDate;
    const dateString = dateToFormat.toDate().toDateString();
    const formattedDate = dateString.substr(4, dateString.length);
    return formattedDate;
  };

  const AboutPlace = () => {
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
          {auth.currentUser.uid === data.selectedPlace.userId && (
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

  const PlaceRating = () => {
    return <h1>Rating</h1>;
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className={classes.dialogTitle}>
        <AppBar position="static" color="primary">
          <Tabs
            value={selectedTab}
            onChange={(e, value) => setSelectedTab(value)}
            centered
          >
            <Tab label="About" />
            <Tab label="Rating" />
          </Tabs>
        </AppBar>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 0 && <AboutPlace />}
        {selectedTab === 1 && <PlaceRating />}
      </DialogContent>
    </Dialog>
  );
};

PlaceDialog.propTypes = {
  data: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  setPlaceDialogOpen: PropTypes.func.isRequired,
  setSlideshowDialogOpen: PropTypes.func.isRequired,
  clearSelectedPlace: PropTypes.func.isRequired,
  setPlaceFormDialogOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  dialogOpen: state.interface.dialogsOpen.selectedPlace,
});

const mapActionsToProps = {
  setPlaceDialogOpen,
  setSlideshowDialogOpen,
  clearSelectedPlace,
  setPlaceFormDialogOpen,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceDialog);
