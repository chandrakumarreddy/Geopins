import React, { useContext } from "react";
import GoogleLogin from "react-google-login";
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import context from "../../context";

const ME_QUERY = `
  query {
      me {
      _id
      name
      email
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const { dispatch } = useContext(context);
  const success = async googleUser => {
    const { id_token } = googleUser.getAuthResponse();
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { Authorization: id_token }
    });
    try {
      const data = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: data.me });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
      onSuccess={success}
      isSignedIn={true}
    />
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
