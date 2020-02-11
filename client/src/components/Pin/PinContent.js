import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FaceIcon from "@material-ui/icons/Face";
import format from "date-fns/format";
import context from "../../context";
import CreateComment from "../Comment/CreateComment";
import Comments from "../Comment/Comments";

const PinContent = ({ classes }) => {
  const {
    state: { currentPin }
  } = React.useContext(context);
  const {
    title,
    createdAt,
    content,
    comments,
    author: { name }
  } = currentPin;
  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h4" gutterBottom color="primary">
        {title}
      </Typography>
      <Typography component="h3" variant="h6" className={classes.text}>
        <FaceIcon className={classes.icon} />
        {name}
      </Typography>
      <Typography variant="subtitle2" className={classes.text} gutterBottom>
        <AccessTimeIcon className={classes.icon} />
        {format(Number(createdAt), "MMM Do, YYYY")}
      </Typography>
      <Typography variant="subtitle1" color="inherit" gutterBottom>
        {content}
      </Typography>
      <CreateComment />
      {comments && <Comments comments={comments} />}
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
