import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
// Material UI
import "fontsource-rajdhani";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
// Images
import LogoImage from "../img/logo.svg";
// Redux
import { connect } from "react-redux";
import { signUpUser, clearError } from "../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 30,
    maxWidth: 500,
    [theme.breakpoints.down("sm")]: {
      border: 0,
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    marginRight: 20,
  },
  logoHeader: {
    fontFamily: "rajdhani",
  },
  formInput: {
    marginBottom: "25px",
  },
  formHeader: {
    margin: "30px 0px 20px 0px",
    textAlign: "center",
  },
  buttonsGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  errorMessage: {
    margin: "30px 0",
  },
}));

const Register = ({ user, signUpUser, clearError }) => {
  const classes = useStyles();
  const history = useHistory();
  // Refs
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  // Clear error on page load
  useEffect(() => {
    clearError();
  }, []);

  // Submit new user
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUserData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };

    signUpUser(
      newUserData.email,
      newUserData.password,
      newUserData.confirmPassword,
      history
    );
  };

  return (
    <Paper className={classes.paper} variant="outlined">
      <div className={classes.headerContainer}>
        <img
          src={LogoImage}
          height="40"
          className={classes.logoImage}
          alt="logo"
        />
        <Typography variant="h4" className={classes.logoHeader}>
          Travel-Tracker
        </Typography>
      </div>
      <Typography variant="h5" className={classes.formHeader}>
        Create new account
      </Typography>
      <form onSubmit={handleSubmit}>
        {user.error && (
          <Alert severity="error" className={classes.errorMessage}>
            {user.error}
          </Alert>
        )}
        <TextField
          variant="outlined"
          id="email"
          type="email"
          label="Adress e-mail"
          className={classes.formInput}
          inputRef={emailRef}
          required
          fullWidth
        />
        <TextField
          variant="outlined"
          id="password"
          type="password"
          label="Password"
          className={classes.formInput}
          inputRef={passwordRef}
          required
          fullWidth
        />
        <TextField
          variant="outlined"
          id="confirm-password"
          type="password"
          label="Confirm Password"
          className={classes.formInput}
          inputRef={confirmPasswordRef}
          required
          fullWidth
        />
        <div className={classes.buttonsGroup}>
          <Link to="/login">
            <Button type="button" color="primary">
              Sign In
            </Button>
          </Link>
          <Button
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            disabled={user.loading}
          >
            {user.loading ? (
              <CircularProgress color="primary" size={30} />
            ) : (
              <p>Save</p>
            )}
          </Button>
        </div>
      </form>
    </Paper>
  );
};

Register.propTypes = {
  user: PropTypes.object.isRequired,
  signUpUser: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { signUpUser, clearError })(Register);
