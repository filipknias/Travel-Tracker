import React, { useState } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import axios from "axios";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
// Icons
import MarkerIcon from "@material-ui/icons/Room";
// Redux
import { connect } from "react-redux";
import { setViewport } from "../../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    padding: "0 10px",
    flex: 1,
  },
  inputPaper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      minWidth: "350px",
    },
    [theme.breakpoints.down("sm")]: {
      flex: 1,
      margin: 0,
    },
  },
  popoverContent: {
    maxWidth: "350px",
    width: "350px",
  },
}));

const SearchBar = ({ data, setViewport }) => {
  const classes = useStyles();
  // State
  const [anchorEl, setAnchorEl] = useState(null);
  const [places, setPlaces] = useState([]);
  const open = Boolean(anchorEl);

  const fetchPlaces = debounce(async (searchValue, target) => {
    if (searchValue.trim() === "") return;

    const results = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
    );
    const formattedPlaces = results.data.features.map((result) => {
      return result;
    });

    setPlaces(formattedPlaces);
    setAnchorEl(target);
  }, 800);

  const handleInputClick = (e) => {
    if (e.target.value.trim() !== "") {
      fetchPlaces(e.target.value, e.currentTarget);
    }
  };

  const handleLocationClick = (coords) => {
    setViewport({
      ...data.viewport,
      longitude: coords[0],
      latitude: coords[1],
      zoom: 12,
    });
    setAnchorEl(null);
  };

  return (
    <>
      <Paper className={classes.inputPaper}>
        <InputBase
          type="text"
          placeholder="Search"
          className={classes.searchInput}
          onChange={(e) => fetchPlaces(e.target.value, e.currentTarget)}
          onClick={(e) => handleInputClick(e)}
        />
      </Paper>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{ marginTop: 5 }}
      >
        <div className={classes.popoverContent}>
          {places.length > 0 ? (
            <List>
              {places.map((place) => (
                <ListItem
                  key={place.id}
                  onClick={() =>
                    handleLocationClick(place.geometry.coordinates)
                  }
                  button
                >
                  <MarkerIcon fontSize="small" style={{ marginRight: 8 }} />
                  <ListItemText primary={place.place_name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <div style={{ padding: "10px 0" }}>
              <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                No places found
              </Typography>
            </div>
          )}
        </div>
      </Popover>
    </>
  );
};

SearchBar.propTypes = {
  data: PropTypes.object.isRequired,
  setViewport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { setViewport })(SearchBar);
