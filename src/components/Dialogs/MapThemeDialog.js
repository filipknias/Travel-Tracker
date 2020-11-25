import React, { useState } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
// Redux
import { connect } from "react-redux";
import { setMapStyle } from "../../redux/actions/dataActions";
import { setMapThemeDialogOpen } from "../../redux/actions/interfaceActions";

const useStyles = makeStyles({
  themeIcon: {
    marginLeft: 10,
  },
  dialogTitle: {
    paddingLeft: 80,
    paddingRight: 80,
  },
  dialogContent: {
    padding: 0,
  },
  submitButton: {
    marginTop: 10,
  },
});

const MapThemeDialog = ({
  dialogOpen,
  data,
  setMapStyle,
  setAnchorEl,
  setMapThemeDialogOpen,
}) => {
  const classes = useStyles();
  // State
  const [selectedUrl, setSelectedUrl] = useState(data.mapStyle);

  const MAP_STYLES = [
    {
      mapTitle: "Streets Theme",
      mapURL: "mapbox://styles/mapbox/streets-v11",
    },
    {
      mapTitle: "Outdoors Theme",
      mapURL: "mapbox://styles/mapbox/outdoors-v11",
    },
    {
      mapTitle: "Light Theme",
      mapURL: "mapbox://styles/mapbox/light-v10",
    },
    {
      mapTitle: "Dark Theme",
      mapURL: "mapbox://styles/mapbox/dark-v10",
    },
    {
      mapTitle: "Satellite Theme",
      mapURL: "mapbox://styles/mapbox/satellite-streets-v11",
    },
    {
      mapTitle: "Preview Day Theme",
      mapURL: "mapbox://styles/mapbox/navigation-preview-day-v4",
    },
    {
      mapTitle: "Preview Night Theme",
      mapURL: "mapbox://styles/mapbox/navigation-preview-night-v4",
    },
    {
      mapTitle: "Guidance Day Theme",
      mapURL: "mapbox://styles/mapbox/navigation-guidance-day-v4",
    },
    {
      mapTitle: "Guidance Night Theme",
      mapURL: "mapbox://styles/mapbox/navigation-guidance-night-v4",
    },
  ];

  const handleThemeSubmit = () => {
    localStorage.setItem("TRAVEL-TRACKER-MAP-STYLE", selectedUrl);
    setMapStyle(selectedUrl);
    setAnchorEl(null);
    setMapThemeDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setMapThemeDialogOpen(false)}>
      <DialogTitle className={classes.dialogTitle}>
        Choose Map Theme
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <List>
          {MAP_STYLES.map((mapStyle) => (
            <ListItem
              onClick={() => setSelectedUrl(mapStyle.mapURL)}
              key={mapStyle.mapURL}
              button
            >
              <Radio
                value={mapStyle.mapURL}
                onChange={() => setSelectedUrl(mapStyle.mapURL)}
                checked={selectedUrl === mapStyle.mapURL}
              />
              <ListItemText primary={mapStyle.mapTitle} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Button
        variant="contained"
        color="primary"
        className={classes.submitButton}
        onClick={handleThemeSubmit}
      >
        Submit
      </Button>
    </Dialog>
  );
};

MapThemeDialog.propTypes = {
  data: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  setMapStyle: PropTypes.func.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
  setMapThemeDialogOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  dialogOpen: state.interface.dialogsOpen.mapTheme,
});

const mapActionsToProps = {
  setMapStyle,
  setMapThemeDialogOpen,
};

export default connect(mapStateToProps, mapActionsToProps)(MapThemeDialog);
