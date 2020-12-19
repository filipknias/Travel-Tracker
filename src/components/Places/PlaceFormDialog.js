import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Alert from "@material-ui/lab/Alert";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
// Redux
import store from "../../redux/store";
import { connect } from "react-redux";
import {
  resetCoords,
  addPlace,
  editPlace,
  clearError,
} from "../../redux/actions/dataActions";
import { setPlaceFormDialogOpen } from "../../redux/actions/interfaceActions";
// FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: "center",
  },
  markerColorGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  marker: {
    fontSize: 60,
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      fontSize: 40,
      marginRight: 5,
    },
  },
  markerColorPick: {
    borderRadius: "50%",
    margin: "0 10px",
    width: 50,
    height: 50,
    cursor: "pointer",
    "&:hover": {
      opacity: "0.8",
    },
    [theme.breakpoints.down("sm")]: {
      width: 25,
      height: 25,
      margin: "0 5px",
    },
  },
  formSection: {
    margin: "30px 0",
    "&:nth-child(2)": {
      marginTop: 10,
    },
    "&:last-child": {
      marginBottom: 10,
    },
  },
  formAlert: {
    marginBottom: 20,
  },
  filePondText: {
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
}));

const PlaceFormDialog = ({
  data,
  selectedPlace,
  dialogOpen,
  resetCoords,
  clearError,
  addPlace,
  editPlace,
  setPlaceFormDialogOpen,
}) => {
  const classes = useStyles();
  const MARKER_COLORS = [
    "#f44336",
    "#ff9800",
    "#ffea00",
    "#2196f3",
    "#4caf50",
    "#8561c5",
  ];
  // State
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [markerColor, setMarkerColor] = useState(MARKER_COLORS[0]);
  const [storagePhotos, setStoragePhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [publicSwitch, setPublicSwitch] = useState(false);
  const [visitDate, setVisitDate] = useState(new Date());
  const [photosLoaded, setPhotosLoaded] = useState(true);

  const MarkerColorPick = ({ color }) => {
    return (
      <div
        className={classes.markerColorPick}
        style={{ backgroundColor: color }}
        onClick={() => setMarkerColor(color)}
      ></div>
    );
  };

  const handleDialogClose = () => {
    setPlaceFormDialogOpen(false);
    setStoragePhotos([]);
    setPhotos([]);
    resetCoords();
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPlace) {
      await editPlace(
        selectedPlace.id,
        selectedPlace.location,
        location,
        description,
        markerColor,
        selectedPlace.photos,
        photos,
        publicSwitch,
        visitDate
      );
    } else {
      await addPlace(
        data.coords[0],
        data.coords[1],
        location,
        description,
        markerColor,
        photos,
        publicSwitch,
        visitDate
      );
    }

    const error = store.getState().data.error;
    if (!error) {
      handleDialogClose();
    }
  };

  const filePondInit = async () => {
    if (!selectedPlace) return;
    if (selectedPlace.photos.length === 0) {
      setPhotosLoaded(true);
    } else {
      setPhotosLoaded(false);
    }

    selectedPlace.photos.forEach(async (photo) => {
      const url = `https://cors-anywhere.herokuapp.com/${photo.url}`;
      const urlResponse = await fetch(url);
      const blob = await urlResponse.blob();
      setStoragePhotos((prevPhotos) => [...prevPhotos, blob]);
    });
  };

  useEffect(() => {
    if (selectedPlace) {
      setLocation(selectedPlace.location);
      setDescription(selectedPlace.description);
      setMarkerColor(selectedPlace.markerColor);
      setPublicSwitch(selectedPlace.public);
      setVisitDate(selectedPlace.visitDate.toDate());
    } else {
      setLocation("");
      setDescription("");
      setMarkerColor(MARKER_COLORS[0]);
      setPublicSwitch(false);
      setVisitDate(new Date());
      setPhotosLoaded(true);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (!selectedPlace) return;

    if (storagePhotos.length < selectedPlace.photos.length) {
      setPhotosLoaded(false);
    } else {
      setPhotosLoaded(true);
    }
  }, [storagePhotos]);

  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle className={classes.dialogTitle}>
        {selectedPlace ? (
          <p>Edit place</p>
        ) : (
          <p>Few more steps to add your place</p>
        )}
      </DialogTitle>
      <DialogContent>
        {data.error && (
          <Alert severity="error" className={classes.formAlert}>
            {data.error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={publicSwitch}
                onChange={() => setPublicSwitch((prevPublic) => !prevPublic)}
              />
            }
            label="Make Public"
          />
          <div className={classes.formSection}>
            <TextField
              label="Place Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div className={classes.formSection}>
            <TextField
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </div>
          <div className={classes.formSection}>
            <div className={classes.markerColorGroup}>
              <Tooltip title="Marker color">
                <MarkerIcon
                  style={{ color: markerColor }}
                  className={classes.marker}
                />
              </Tooltip>
              {MARKER_COLORS.map((markerColor) => (
                <MarkerColorPick color={markerColor} key={markerColor} />
              ))}
            </div>
          </div>
          <div className={classes.formSection}>
            <Typography variant="subtitle1" className={classes.filePondText}>
              Import photos from this place
            </Typography>
            <FilePond
              oninit={filePondInit}
              disabled={data.loading || !photosLoaded}
              className={classes.filePondInput}
              files={!data.loading ? photos.concat(storagePhotos) : photos}
              acceptedFileTypes={["image/png", "image/jpeg"]}
              labelFileTypeNotAllowed="Invalid file type"
              allowMultiple={true}
              onupdatefiles={(files) =>
                setPhotos(files.map((fileItem) => fileItem.file))
              }
            />
          </div>
          <div className={classes.formSection}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                format="MM/dd/yyyy"
                label="Visit Date"
                value={visitDate}
                onChange={(date) => setVisitDate(date)}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.formSection}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={data.loading || !photosLoaded}
              fullWidth
            >
              {data.loading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                <p>Complete</p>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

PlaceFormDialog.propTypes = {
  data: PropTypes.object.isRequired,
  selectedPlace: PropTypes.object,
  dialogOpen: PropTypes.bool.isRequired,
  resetCoords: PropTypes.func.isRequired,
  addPlace: PropTypes.func.isRequired,
  editPlace: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  setPlaceFormDialogOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  selectedPlace: state.data.selectedPlace,
  dialogOpen: state.interface.dialogsOpen.placeForm,
});

const mapActionsToProps = {
  resetCoords,
  addPlace,
  editPlace,
  clearError,
  setPlaceFormDialogOpen,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceFormDialog);
