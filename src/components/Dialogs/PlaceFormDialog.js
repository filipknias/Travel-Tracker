import React, { useState, useRef } from "react";
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
  dialogOpen,
  resetCoords,
  clearError,
  addPlace,
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
  const [markerColor, setMarkerColor] = useState(MARKER_COLORS[0]);
  const [photos, setPhotos] = useState([]);
  const [publicSwitch, setPublicSwitch] = useState(false);
  const [visitDate, setVisitDate] = useState(new Date());
  // Refs
  const locationRef = useRef();
  const descriptionRef = useRef();

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
    setPhotos([]);
    resetCoords();
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const locationValue = locationRef.current.value;
    const descriptionValue = descriptionRef.current.value;

    await addPlace(
      data.coords[0],
      data.coords[1],
      locationValue,
      descriptionValue,
      markerColor,
      photos,
      publicSwitch,
      visitDate
    );

    const error = store.getState().data.error;
    if (!error) {
      handleDialogClose();
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle className={classes.dialogTitle}>
        Few more steps to add your place
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
              inputRef={locationRef}
              required
              fullWidth
            />
          </div>
          <div className={classes.formSection}>
            <TextField
              label="Description (optional)"
              inputRef={descriptionRef}
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
              className={classes.filePondInput}
              files={photos}
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
              disabled={data.loading}
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
  dialogOpen: PropTypes.bool.isRequired,
  resetCoords: PropTypes.func.isRequired,
  addPlace: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  setPlaceFormDialogOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  dialogOpen: state.interface.dialogsOpen.placeForm,
});

const mapActionsToProps = {
  resetCoords,
  addPlace,
  clearError,
  setPlaceFormDialogOpen,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceFormDialog);
