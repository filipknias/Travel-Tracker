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
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
// Icons
import ThemeIcon from "@material-ui/icons/Explore";
// Redux
import { connect } from "react-redux";
import { setMapStyle } from "../../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  themeIcon: {
    marginLeft: 10,
  },
  dialogTitle: {
    paddingLeft: 80,
    paddingRight: 80,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 40,
      paddingRight: 40,
    },
  },
  dialogContent: {
    padding: 0,
  },
  submitButton: {
    marginTop: 10,
  },
}));

const MapThemeDialog = ({ data, setMapStyle, setAnchorEl }) => {
  const classes = useStyles();
  // State
  const [selectedUrl, setSelectedUrl] = useState(data.mapStyle);
  const [open, setOpen] = useState(false);

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
    setOpen(false);
  };

  return (
    <>
      <ListItem onClick={() => setOpen(true)} button>
        <ListItemIcon>
          <ThemeIcon className={classes.themeIcon} />
        </ListItemIcon>
        <ListItemText primary="Map Theme" />
      </ListItem>
      <Dialog open={open} onClose={() => setOpen(false)}>
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
    </>
  );
};

MapThemeDialog.propTypes = {
  data: PropTypes.object.isRequired,
  setMapStyle: PropTypes.func.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { setMapStyle })(MapThemeDialog);
