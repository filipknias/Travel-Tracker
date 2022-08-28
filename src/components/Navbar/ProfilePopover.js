import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
import LogoutIcon from "@material-ui/icons/ExitToApp";
import ResetPasswordIcon from "@material-ui/icons/Lock";
// Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const useStyles = makeStyles({
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
  avatarLetter: {
    fontSize: 15,
  },
});

const ProfilePopover = ({ user, logoutUser }) => {
  const classes = useStyles();
  // State
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  if (user.data.displayName === null || user.data.avatarColor === null) return null;
  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar
          alt="User avatar"
          src={user.data.photoURL}
          className={classes.profileAvatar}
          style={{ backgroundColor: user.data.avatarColor }}
        >
        <p className={classes.avatarLetter}>
          {user.data.displayName.charAt(0).toUpperCase()}
        </p>
        </Avatar>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <div className={classes.profileInfo}>
          <Avatar
            className={classes.commentAvatar}
            alt="User avatar"
            style={{ backgroundColor: user.data.avatarColor }}
          >
            <p>{user.data.displayName.charAt(0).toUpperCase()}</p>
          </Avatar>
          <div className={classes.profileNameData}>
            <Typography variant="h6">{user.data.displayName}</Typography>
            <Typography variant="body2">{user.data.email}</Typography>
          </div>
        </div>
        <Divider />
        <List>
          <ListItem component={Link} to="/reset-password" button>
            <ListItemIcon>
              <ResetPasswordIcon />
            </ListItemIcon>
            <ListItemText primary="Reset Password" />
          </ListItem>
          <ListItem onClick={() => logoutUser()} button>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

ProfilePopover.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default connect(null, { logoutUser })(ProfilePopover);
