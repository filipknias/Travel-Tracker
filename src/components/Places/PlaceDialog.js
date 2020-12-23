import React, { useState } from "react";
import PropTypes from "prop-types";
// Components
import PlaceRatingTab from "./PlaceRatingTab";
import AboutPlaceTab from "./AboutPlaceTab";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
// Icons
import OpenDialogIcon from "@material-ui/icons/Launch";
// Redux
import { connect } from "react-redux";
import {
  setSelectedPlace,
  clearSelectedPlace,
} from "../../redux/actions/dataActions";

const useStyles = makeStyles({
  dialogTitle: {
    padding: 0,
    marginBottom: 20,
  },
});

const PlaceDialog = ({ place, data, setSelectedPlace, clearSelectedPlace }) => {
  const classes = useStyles();
  // State
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
    setSelectedPlace(place);
  };

  const handleDialogClose = () => {
    setOpen(false);
    clearSelectedPlace();
  };

  // TODO: add place/:placeId route to open this dialog

  return (
    <>
      <Tooltip title="Open Place">
        <IconButton onClick={handleDialogOpen}>
          <OpenDialogIcon color="primary" fontSize="small" />
        </IconButton>
      </Tooltip>
      {data.selectedPlace && (
        <Dialog open={open} onClose={handleDialogClose} fullWidth>
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
            {selectedTab === 0 && <AboutPlaceTab />}
            {selectedTab === 1 && <PlaceRatingTab />}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

PlaceDialog.propTypes = {
  place: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  clearSelectedPlace: PropTypes.func.isRequired,
  setSelectedPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  setSelectedPlace,
  clearSelectedPlace,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceDialog);
