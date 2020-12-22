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
// Redux
import { connect } from "react-redux";
import { clearSelectedPlace } from "../../redux/actions/dataActions";
import { setPlaceDialogOpen } from "../../redux/actions/interfaceActions";

const useStyles = makeStyles({
  dialogTitle: {
    padding: 0,
    marginBottom: 20,
  },
});

const PlaceDialog = ({
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

  // TODO: remove interface redux state and move dialogs triggers to their dialog components

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
        {selectedTab === 0 && <AboutPlaceTab />}
        {selectedTab === 1 && <PlaceRatingTab />}
      </DialogContent>
    </Dialog>
  );
};

PlaceDialog.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  setPlaceDialogOpen: PropTypes.func.isRequired,
  clearSelectedPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dialogOpen: state.interface.dialogsOpen.selectedPlace,
});

const mapActionsToProps = {
  setPlaceDialogOpen,
  clearSelectedPlace,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceDialog);
