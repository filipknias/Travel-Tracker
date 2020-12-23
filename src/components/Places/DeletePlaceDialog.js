import React, { useState } from "react";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
// Icons
import DeleteIcon from "@material-ui/icons/Delete";
// Redux
import { connect } from "react-redux";
import {
  deletePlace,
  clearSelectedPlace,
} from "../../redux/actions/dataActions";

const useStyles = makeStyles({
  btnGroup: {
    display: "flex",
    justifyContent: "space-between",
    margin: "30px 0px 5px 0px",
  },
});

const DeletePlaceDialog = ({ data, deletePlace, clearSelectedPlace }) => {
  const classes = useStyles();
  // State
  const [open, setOpen] = useState(false);

  const handleDeletePlace = () => {
    deletePlace(data.selectedPlace.id);
    clearSelectedPlace();
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Delete Place">
        <IconButton onClick={() => setOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs">
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete this place ?
          </Typography>
          {data.error && <Alert severity="error">{data.error}</Alert>}
          <div className={classes.btnGroup}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeletePlace}
            >
              {data.loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <p>Delete</p>
              )}
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

DeletePlaceDialog.propTypes = {
  data: PropTypes.object.isRequired,
  deletePlace: PropTypes.func.isRequired,
  clearSelectedPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  deletePlace,
  clearSelectedPlace,
};

export default connect(mapStateToProps, mapActionsToProps)(DeletePlaceDialog);
