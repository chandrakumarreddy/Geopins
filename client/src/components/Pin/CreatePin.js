import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import axios from "axios";
import context from "../../context";
import { CREATE_PIN } from "../../graphql/mutations";
import { useClient } from "../../client";

const handleImageUpload = async image => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "geopins");
  data.append("cloud_name", "dw8cf1osx");
  const res = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, data);
  return res.data.url;
};

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = React.useContext(context);
  const [title, setTitle] = React.useState("");
  const [image, setImage] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const handleDiscardDraft = () => {
    setContent("");
    setTitle("");
    setImage("");
    dispatch({ type: "DELETE_DRAFT" });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const { latitude, longitude } = state.draft;
    const url = await handleImageUpload(image);
    const variables = {
      title,
      image: url,
      content,
      latitude,
      longitude
    };
    await client.request(CREATE_PIN, variables);
    setSubmitting(false);
    handleDiscardDraft();
  };
  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignItems}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="title"
          placeholder="Insert a Pin"
          onChange={e => setTitle(e.target.value)}
          autoComplete="off"
        />
        <input
          type="file"
          accept="image/*"
          id="image"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button component="span" size="small" className={classes.button}>
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          multiline
          rows={"6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleDiscardDraft}
          disabled={!title.trim() && !content.trim() && !image}
        >
          <ClearIcon /> Discard
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || !image || submitting}
        >
          Submit <SaveIcon />{" "}
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
