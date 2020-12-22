import React, { useState } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Carousel from "react-material-ui-carousel";
// Icons
import SettingsIcon from "@material-ui/icons/Settings";
// Redux
import { connect } from "react-redux";

const useStyles = makeStyles({
  slideshowBtn: {
    marginLeft: "auto",
    display: "block",
  },
  photo: {
    objectFit: "contain",
    width: "100%",
  },
  optionsBtn: {
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  popoverContent: {
    padding: "15px 10px",
  },
});

const SlideshowDialog = ({ photos }) => {
  const classes = useStyles();
  // State
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [autoplaySwitch, setAutoplaySwitch] = useState(true);
  const [autoplayDelay, setAutoplayDelay] = useState(5000);

  const AutoPlayPopover = () => {
    return (
      <Popover
        open={Boolean(anchorEl)}
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
          <div>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={autoplaySwitch}
                  onChange={() => setAutoplaySwitch((autoDelay) => !autoDelay)}
                />
              }
              label="Auto Play"
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <FormControl disabled={autoplaySwitch ? false : true}>
              <InputLabel>Delay</InputLabel>
              <Select
                value={autoplayDelay}
                onChange={(e) => setAutoplayDelay(e.target.value)}
                label="Delay"
              >
                <MenuItem value={5000}>5 seconds</MenuItem>
                <MenuItem value={10000}>10 seconds</MenuItem>
                <MenuItem value={15000}>15 seconds</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </Popover>
    );
  };

  return (
    <>
      <Button
        color="primary"
        className={classes.slideshowBtn}
        onClick={() => setOpen(true)}
      >
        Slideshow
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent style={{ padding: "0px 0px 10px 0px" }}>
          <Carousel
            autoPlay={autoplaySwitch && !anchorEl}
            interval={autoplayDelay}
          >
            {photos.map((photo, index) => (
              <img
                src={photo.url}
                alt={photo.url}
                key={index}
                className={classes.photo}
              />
            ))}
          </Carousel>
          <Tooltip title="Auto Play">
            <IconButton
              className={classes.optionsBtn}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <AutoPlayPopover />
        </DialogContent>
      </Dialog>
    </>
  );
};

SlideshowDialog.propTypes = {
  photos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  photos: state.data.selectedPlace.photos,
});

export default connect(mapStateToProps, null)(SlideshowDialog);
