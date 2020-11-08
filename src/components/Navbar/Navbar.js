import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Components
import SearchBar from "./SearchBar";
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
import GalleryIcon from "@material-ui/icons/Collections";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import ReturnIcon from "@material-ui/icons/KeyboardReturn";
import LoginIcon from "@material-ui/icons/AccountBox";

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
  tooltip: {
    fontSize: 12,
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

const Navbar = () => {
  const classes = useStyles();
  const [searchBarMobile, setSearchBarMobile] = useState(false);

  // Add window event to hide mobile search bar on resizing window
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
                <Tooltip title="Search" classes={classes}>
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
                  <Tooltip title="Map" classes={classes}>
                    <IconButton color="inherit">
                      <MapIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
                <Tooltip title="My Gallery" classes={classes}>
                  <IconButton color="inherit">
                    <GalleryIcon />
                  </IconButton>
                </Tooltip>
              </Hidden>

              <Tooltip title="Notifications" classes={classes}>
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Link to="/login">
                <Tooltip title="Sign In" classes={classes}>
                  <IconButton color="inherit">
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
