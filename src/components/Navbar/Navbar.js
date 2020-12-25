import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// Components
import SearchBar from "./SearchBar";
import ProfilePopover from "./ProfilePopover";
import PlacesPopover from "./PlacesPopover";
// Material UI
import "fontsource-rajdhani";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Hidden from "@material-ui/core/Hidden";
// Icons
import MapIcon from "@material-ui/icons/Explore";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import ReturnIcon from "@material-ui/icons/KeyboardReturn";
import LoginIcon from "@material-ui/icons/AccountBox";
// Redux
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.secondary.main,
  },
  toolBar: {
    justifyContent: "space-between",
  },
  appTitle: {
    fontFamily: "rajdhani",
  },
  searchIcon: {
    marginLeft: "auto",
  },
  returnIcon: {
    marginRight: 25,
    paddingRight: 0,
  },
  navbarRight: {
    display: "flex",
    alignItems: "center",
  },
}));

const Navbar = ({ user }) => {
  const classes = useStyles();
  const [searchBarMobile, setSearchBarMobile] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setSearchBarMobile(false);
    });
  }, []);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        {searchBarMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={() => setSearchBarMobile(false)}
              className={classes.returnIcon}
            >
              <ReturnIcon />
            </IconButton>
            <SearchBar />
          </>
        ) : (
          <>
            <Link to="/">
              <Typography className={classes.appTitle} variant="h5" noWrap>
                Travel Tracker
              </Typography>
            </Link>

            <div className={classes.navbarRight}>
              <Hidden mdUp>
                <Tooltip title="Search">
                  <IconButton
                    color="inherit"
                    onClick={() => setSearchBarMobile(true)}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              </Hidden>

              <Hidden smDown>
                <SearchBar />
                <Link to="/">
                  <Tooltip title="Map">
                    <IconButton color="inherit">
                      <MapIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Hidden>

              {user.auth ? (
                <>
                  <PlacesPopover />
                  <Tooltip title="Notifications">
                    <IconButton color="inherit">
                      <NotificationsIcon />
                    </IconButton>
                  </Tooltip>
                  <ProfilePopover user={user} />
                </>
              ) : (
                <Link to="/login">
                  <Tooltip title="Sign In">
                    <IconButton color="inherit">
                      <LoginIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              )}
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Navbar);
