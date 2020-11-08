import React, { useState } from "react";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
// Icons
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Close";

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
  clearIcon: {
    paddingRight: 5,
    marginLeft: "auto",
  },
  inputIcon: {
    padding: 8,
  },
  iconsGroup: {
    display: "flex",
    alignItems: "center",
  },
}));

const SearchBar = () => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const handleClear = () => {
    if (value.length > 0) setValue("");
  };

  return (
    <Paper className={classes.inputPaper}>
      <InputBase
        type="text"
        placeholder="Search"
        className={classes.searchInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className={classes.iconsGroup}>
        <IconButton className={classes.inputIcon}>
          <SearchIcon />
        </IconButton>
        {value.length > 0 && (
          <IconButton className={classes.inputIcon} onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        )}
      </div>
    </Paper>
  );
};

export default SearchBar;
