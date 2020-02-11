import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import context from "./context";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { state } = useContext(context);
  return (
    <Route
      render={props =>
        state.isAuth ? <Component {...props} /> : <Redirect to="/login" />
      }
      {...rest}
    />
  );
}
