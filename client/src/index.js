import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./pages/App";
import Splash from "./pages/Splash";

import context from "./context";
import reducer from "./reducer";

import "mapbox-gl/dist/mapbox-gl.css";

const Root = () => {
  const initialState = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Router>
      <Switch>
        <context.Provider value={{ state, dispatch }}>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Splash} />
        </context.Provider>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
