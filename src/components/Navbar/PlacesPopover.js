import React, { useState } from "react";
import PropTypes from "prop-types";
// Components
import PlaceDialog from "../Places/PlaceDialog";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
// Icons
import ListIcon from "@material-ui/icons/ViewList";
import MarkerIcon from "@material-ui/icons/Room";
// Redux
import { connect } from "react-redux";

const useStyles = makeStyles({
  paper: {
    minWidth: 300,
  },
});

const PlacesPopover = ({ user, data }) => {
  const classes = useStyles();
  // State
  const [places, setPlaces] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverEnter = () => {
    const userPlaces = data.places.filter((place) => {
      return place.userId === user.data.id;
    });
    setPlaces(userPlaces);
  };

  return (
    <>
      <Tooltip title="My Places">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="inherit"
        >
          <ListIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onEnter={handlePopoverEnter}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        classes={classes}
      >
        <List>
          {places.map((place) => (
            <ListItem key={place.id}>
              <MarkerIcon
                style={{ color: place.markerColor, marginRight: 5 }}
              />
              <ListItemText primary={place.location} />
              <ListItemSecondaryAction>
                <PlaceDialog place={place} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

PlacesPopover.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

export default connect(mapStateToProps, null)(PlacesPopover);
