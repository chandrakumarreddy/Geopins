import React from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import context from "../../context";
import { useClient } from "../../client";
import { ADD_COMMENT } from "../../graphql/mutations";

const CreateComment = ({ classes }) => {
  const client = useClient();
  const {
    state: { currentPin }
  } = React.useContext(context);
  const [comment, setComment] = React.useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    await client.request(ADD_COMMENT, {
      text: comment,
      pinId: currentPin._id
    });
    setComment("");
  };
  return (
    <React.Fragment>
      <form className={classes.form} onSubmit={handleSubmit}>
        <IconButton>
          <ClearIcon className={classes.clearButton} />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Enter your comments"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <IconButton onClick={handleSubmit}>
          <SendIcon className={classes.sendButton} />
        </IconButton>
      </form>
      <Divider />
    </React.Fragment>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
