import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../App.css";
// Pages
import Map from "../pages/Map";
import Login from "../pages/Login";
import Register from "../pages/Register";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Map} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
};

export default App;
