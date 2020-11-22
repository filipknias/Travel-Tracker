import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
// Redux
import { connect } from "react-redux";
import { resetCoords } from "../../redux/actions/dataActions";
// FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const useStyles = makeStyles({
  markerColorGroup: {
    display: "flex",
    alignItems: "center",
  },
  marker: {
    fontSize: 60,
    marginRight: 20,
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
});

const PlaceFormDialog = ({ open, setOpen, resetCoords }) => {
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
  const [images, setImages] = useState([]);
  const [publicSwitch, setPublicSwitch] = useState(false);
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
    setOpen(false);
    resetCoords();
    setImages([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const locationValue = locationRef.current.value;
    const descriptionValue = descriptionRef.current.value;
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Few more steps to add your place.</DialogTitle>
        <DialogContent>
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
              <Typography variant="subtitle1" style={{ marginBottom: 10 }}>
                Import photos from this place
              </Typography>
              <FilePond
                className={classes.filePondInput}
                files={images}
                acceptedFileTypes={["image/png", "image/jpeg"]}
                labelFileTypeNotAllowed="Invalid file type"
                allowMultiple={true}
                onupdatefiles={(files) =>
                  setImages(files.map((fileItem) => fileItem.file))
                }
              />
            </div>
            <div className={classes.formSection}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Complete
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

PlaceFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  resetCoords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { resetCoords })(PlaceFormDialog);
