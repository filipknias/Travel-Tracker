import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Rating from "@material-ui/lab/Rating";
import CircularProgress from "@material-ui/core/CircularProgress";
// Icons
import DeleteIcon from "@material-ui/icons/Delete";
// Redux
import { connect } from "react-redux";
import { ratePlace } from "../../redux/actions/dataActions";
// Firebase
import { db } from "../../utilities/firebase";
// Day js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  leaveCommentGroup: {
    display: "flex",
    alignItems: "center",
    margin: "5px 0 20px 0",
  },
  commentInput: {
    flex: 1,
    marginLeft: 20,
  },
  commentBtn: {
    marginLeft: 10,
  },
  btnGroup: {
    marginTop: 30,
    marginLeft: "auto",
    display: "flex",
    justifyContent: "flex-end",
  },
  userCommentGroup: {
    display: "flex",
    alignItems: "center",
  },
  commentAvatar: {
    marginRight: 10,
    width: "30px",
    height: "30px",
    fontSize: 15,
  },
  commentGroup: {
    margin: "20px 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  commentRateGroup: {
    display: "flex",
    alignItems: "center",
  },
  signUpGroup: {
    marginBottom: 15,
  },
  singUpLink: {
    textDecoration: "underline",
    color: theme.palette.primary.main,
  },
}));

const PlaceRatingTab = ({ user, data, ratePlace }) => {
  const classes = useStyles();
  // State
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [valid, setValid] = useState(false);
  // Refs
  const commentRef = useRef();

  useEffect(() => {
    const query = db
      .collection("ratings")
      .where("placeId", "==", data.selectedPlace.id)
      .orderBy("createdAt", "desc");

    query.onSnapshot((snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setRatings(docs);
    });
  }, []);

  useEffect(() => {
    if (comment.trim() !== "" && rate > 0) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [rate, comment]);

  const handleResetRate = () => {
    setComment("");
    setRate(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const comment = commentRef.current.value;
    const userData = {
      displayName: user.data.displayName,
      avatarColor: user.data.avatarColor,
    };
    await ratePlace(rate, comment, data.selectedPlace.id, userData);
    handleResetRate();
  };

  const deleteRate = async (rateId) => {
    const docRef = db.collection("ratings").doc(rateId);
    await docRef.delete();
  };

  return (
    <>
      {user.auth ? (
        <>
          <form onSubmit={handleSubmit}>
            <Rating
              name="place-rating"
              value={rate}
              onChange={(e, value) => setRate(value)}
            />
            <div className={classes.leaveCommentGroup}>
              <Avatar
                style={{ backgroundColor: user.data.avatarColor }}
                alt="User avatar"
              >
                {user.data.displayName.charAt(0).toUpperCase()}
              </Avatar>
              <TextField
                name="text"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                label="Leave a comment"
                inputRef={commentRef}
                className={classes.commentInput}
                multiline
                required
              />
            </div>
            {valid && (
              <div className={classes.btnGroup}>
                <Button type="button" onClick={handleResetRate}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.commentBtn}
                  disabled={data.loading}
                >
                  {data.loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <p>Send</p>
                  )}
                </Button>
              </div>
            )}
          </form>
        </>
      ) : (
        <div className={classes.signUpGroup}>
          <Typography variant="h6">
            Sign up{" "}
            <Link className={classes.singUpLink} to="/login">
              here
            </Link>{" "}
            to give your rate
          </Typography>
        </div>
      )}

      <div>
        <Typography variant="body1">
          Place rated {data.selectedPlace.commentCount} times
        </Typography>

        <div style={{ marginTop: 10 }}>
          {ratings.map((rate, index) => (
            <div key={index} className={classes.commentGroup}>
              <div>
                <div className={classes.userCommentGroup}>
                  <Avatar
                    className={classes.commentAvatar}
                    alt="User avatar"
                    style={{ backgroundColor: rate.user.avatarColor }}
                  >
                    {rate.user.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1">
                    {rate.user.displayName}
                  </Typography>
                </div>
                <div style={{ marginTop: 5 }}>
                  <div className={classes.commentRateGroup}>
                    <Rating name="user-rating" value={rate.rate} readOnly />
                    {rate.createdAt && (
                      <Typography
                        variant="subtitle1"
                        style={{ marginLeft: 15 }}
                      >
                        {dayjs().fromNow(rate.createdAt.toDate())}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="h6">{rate.comment}</Typography>
                </div>
              </div>
              {user.auth && user.data.id === data.selectedPlace.userId && (
                <Tooltip title="Delete">
                  <IconButton onClick={() => deleteRate(rate.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

PlaceRatingTab.propTypes = {
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  ratePlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

const mapActionsToProps = {
  ratePlace,
};

export default connect(mapStateToProps, mapActionsToProps)(PlaceRatingTab);
