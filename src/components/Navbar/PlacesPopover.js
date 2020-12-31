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
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
// Icons
import ListIcon from "@material-ui/icons/ViewList";
import MarkerIcon from "@material-ui/icons/Room";
// Redux
import { connect } from "react-redux";
// Firebase
import { db } from "../../utilities/firebase";

const useStyles = makeStyles({
  paper: {
    minWidth: 300,
  },
});

const PlacesPopover = ({ user }) => {
  const classes = useStyles();
  // State
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverEnter = async () => {
    setLoading(true);

    const query = db.collection("places").where("userId", "==", user.data.id);
    const docs = await query.get();
    const userPlaces = [];

    docs.forEach((doc) => {
      userPlaces.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setPlaces(userPlaces);
    setLoading(false);
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
          {places.length > 0 ? (
            <>
              {loading ? (
                <CircularProgress
                  style={{ margin: "10px auto", display: "block" }}
                  color="primary"
                  size={30}
                />
              ) : (
                <>
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
                </>
              )}
            </>
          ) : (
            <div>
              <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                No places found
              </Typography>
            </div>
          )}
        </List>
      </Popover>
    </>
  );
};

PlacesPopover.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(PlacesPopover);
