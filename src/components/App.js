import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../App.css";
import "fontsource-roboto";
// Material UI
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import customTheme from "../utilities/theme";
import Container from "@material-ui/core/Container";
// Components
import Navbar from "./Navbar/Navbar";
// Pages
import Map from "../pages/Map";
import Login from "../pages/Login";
import Register from "../pages/Register";

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

  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <Switch>
          <Container className={classes.container} maxWidth="xl">
            <Route exact path="/" component={Map} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Container>
        </Switch>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
