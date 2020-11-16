import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../App.css";
// Material UI
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import customTheme from "../utilities/theme";
import Container from "@material-ui/core/Container";
// Components
import AuthRoute from "../utilities/AuthRoute";
import Navbar from "./Navbar/Navbar";
// Pages
import Map from "../pages/Map";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
// Redux
import { Provider } from "react-redux";
import store from "../redux/store";
import { setCurrentUser, logoutUser } from "../redux/actions/userActions";
// Firebase
import { auth } from "../utilities/firebase";

const theme = createMuiTheme(customTheme);

const useStyles = makeStyles({
  container: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
});

const App = () => {
  const classes = useStyles();

  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      store.dispatch(setCurrentUser());
    } else {
      store.dispatch(logoutUser());
    }
  });

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <Switch>
            <Container className={classes.container} maxWidth="xl">
              <Route exact path="/" component={Map} />
              <AuthRoute path="/login" component={Login} />
              <AuthRoute path="/register" component={Register} />
              <Route path="/reset-password" component={ResetPassword} />
            </Container>
          </Switch>
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;
