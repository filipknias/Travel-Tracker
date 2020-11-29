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
// Redux
import { connect } from "react-redux";
import { clearSelectedPlace } from "../../redux/actions/dataActions";
import { setPlaceDialogOpen } from "../../redux/actions/interfaceActions";

const useStyles = makeStyles({
  dialogTitle: {
    padding: 0,
    marginBottom: 20,
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
  clearSelectedPlace,
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
        <div className={classes.photosGroup}>
          {data.selectedPlace.photos.length > 1 && (
            <Button color="primary" className={classes.slideshowBtn}>
              Slideshow
            </Button>
          )}
          {data.selectedPlace.photos.map((photoUrl, index) => (
            <img
              className={classes.photo}
              src={photoUrl}
              alt={photoUrl}
              key={index}
              height="300"
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
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
      <DialogContent>{selectedTab === 0 && <AboutPlace />}</DialogContent>
    </Dialog>
  );
};

PlaceDialog.propTypes = {
  data: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  setPlaceDialogOpen: PropTypes.func.isRequired,
  clearSelectedPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  dialogOpen: state.interface.dialogsOpen.selectedPlace,
});

const mapActionsToProps = {
  setPlaceDialogOpen,
  clearSelectedPlace,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceDialog);
