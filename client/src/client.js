import React from "react";
import { GraphQLClient } from "graphql-request";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "<USE_PRODUCTION_URL>"
    : "http://localhost:4000/graphql";

export const useClient = () => {
  const [state, setState] = React.useState("");
  React.useEffect(() => {
    const id_token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setState(id_token);
  });
  return new GraphQLClient(BASE_URL, {
    headers: { Authorization: state }
  });
};
