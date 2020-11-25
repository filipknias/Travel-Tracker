import React, { useState } from "react";
import PropTypes from "prop-types";
// Components
import PlaceFormDialog from "../Dialogs/PlaceFormDialog";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import AddPlaceIcon from "@material-ui/icons/AddPhotoAlternate";
// Redux
import { connect } from "react-redux";
import { mapUnClick, resetClick } from "../../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    marginTop: 70,
  },
}));

const MapPopup = ({ user, data, mapUnClick, resetClick }) => {
  const classes = useStyles();
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setFormDialogOpen(true);
    resetClick();
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={data.click}
        onClose={mapUnClick}
      >
        {data.coords && (
          <>
            <SnackbarContent
              classes={classes}
              message={`Lng. ${data.coords[0].toFixed(
                3
              )}, Lat. ${data.coords[1].toFixed(3)}`}
              action={
                <>
                  {user.auth && (
                    <Tooltip title="Add Place">
                      <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleDialogOpen}
                      >
                        <AddPlaceIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Close">
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={mapUnClick}
                      style={{ marginLeft: 5 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />
          </>
        )}
      </Snackbar>
      <PlaceFormDialog open={formDialogOpen} setOpen={setFormDialogOpen} />
    </>
  );
};

MapPopup.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  mapUnClick: PropTypes.func.isRequired,
  resetClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

const mapActionsToProps = {
  mapUnClick,
  resetClick,
};

export default connect(mapStateToProps, mapActionsToProps)(MapPopup);
