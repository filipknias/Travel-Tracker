import React, { useState } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
// Icons
import GalleryIcon from "@material-ui/icons/Collections";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import PlaceIcon from "@material-ui/icons/Place";
// Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  profileAvatar: {
    height: 25,
    width: 25,
  },
  popoverAvatar: {
    height: 40,
    width: 40,
  },
  profileInfo: {
    display: "flex",
    padding: "15px 25px",
  },
  profileNameData: {
    marginLeft: 20,
  },
  manageProfileLink: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    marginTop: 5,
  },
}));

const ProfilePopover = ({ user, logoutUser }) => {
  const classes = useStyles();
  // State
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle toggle open popover
  const toggleOpen = (e) => {
    setOpen((prevOpen) => !prevOpen);
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <IconButton onClick={toggleOpen}>
        <Avatar
          alt="profile-image"
          src={user.data.photoURL}
          className={classes.profileAvatar}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          classes={classes}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <div className={classes.profileInfo}>
            <Avatar
              src={user.data.photoURL}
              alt="profile-image"
              className={classes.popoverAvatar}
            />
            <div className={classes.profileNameData}>
              <Typography variant="h6">{user.data.displayName}</Typography>
              <Typography variant="body2">{user.data.email}</Typography>
              <Typography variant="body1" className={classes.manageProfileLink}>
                Manage profile
              </Typography>
            </div>
          </div>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText primary="My Places" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <GalleryIcon />
              </ListItemIcon>
              <ListItemText primary="My Gallery" />
            </ListItem>
            <ListItem onClick={() => logoutUser()} button>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Popover>
      </IconButton>
    </>
  );
};

ProfilePopover.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapActionsToProps = {
  logoutUser,
};

export default connect(null, mapActionsToProps)(ProfilePopover);
