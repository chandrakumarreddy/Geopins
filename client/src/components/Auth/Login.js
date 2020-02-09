import React, { useContext } from "react";
import GoogleLogin from "react-google-login";
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import context from "../../context";
import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(context);
  const success = async googleUser => {
    try {
      const { id_token } = googleUser.getAuthResponse();
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { Authorization: id_token }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
    } catch (error) {
      failure(error);
    }
  };
  const failure = err => {
    console.log(`google auth error ${err.message}`);
  };
  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        style={{ color: "rgb(66,133,244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
        onSuccess={success}
        onFailure={failure}
        isSignedIn={true}
        theme="dark"
      />
    </div>
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
