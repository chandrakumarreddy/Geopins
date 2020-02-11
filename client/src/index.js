import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";

import ProtectedRoute from "./ProtectedRoute";
import App from "./pages/App";
import Splash from "./pages/Splash";

import context from "./context";
import reducer from "./reducer";

import "mapbox-gl/dist/mapbox-gl.css";

import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});

const Root = () => {
  const initialState = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <context.Provider value={{ state, dispatch }}>
            <ProtectedRoute exact path="/" component={App} />
            <Route path="/login" component={Splash} />
          </context.Provider>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
