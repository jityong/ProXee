import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import MyButton from "../../util/MyButton";
// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import "../../App.css";

// Redux stuff
import { connect } from "react-redux";
import {
  postFeed,
  uploadImage,
  getImageUrl,
  clearErrors
} from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme,
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: 10
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%"
  }
});

class PostFeed extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
    feedType: "",
    isUploading: false,
    progress: 0,
    imageUrl: "",
    tag: "none"
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.props !== "none" && nextProps.tags !== "none") {
      return true;
    } else {
      return false;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", open: false, errors: {} });
    }
  }
  handleShareClick = () => {
    this.setState({ feedType: "general" });
  };
  handleQnClick = () => {
    this.setState({ feedType: "question" });
  };
  handlePollClick = () => {
    this.setState({ feedType: "poll" });
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleBack = () => {
    this.setState({ feedType: "" });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.postFeed({
      body: this.state.body,
      userLoc: this.props.userCoord,
      feedType: this.state.feedType,
      imageUrl: this.state.imageUrl,
      tag: this.state.tag
    });
    this.setState({ imageUrl: "" });
    console.log(this.props.userCoord);
  };
  handleImageUpload = imageUrl => event => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
    console.log("in handleImageUpload");
    this.setState({ imageUrl: imageUrl });
    console.log("THIS IS IT" + this.props.data.imageUrl);
  };

  render() {
    const { errors } = this.state;
    const {
      classes,
      tags,
      UI: { loading },
      data: { imageUrl }
    } = this.props;
    const post =
      this.state.feedType === "general" ? (
        <Fragment>
          <TextField
            name="body"
            type="text"
            label="FEED"
            multiline
            rows="3"
            placeholder=" Post a feed"
            error={errors.body ? true : false}
            helperText={errors.body}
            className={classes.textField}
            onChange={this.handleChange}
            fullWidth
          />
          Select tag: 
          <FormControl>
                <Select
                  name="tag"
                  value={this.state.tag}
                  onChange={this.handleChange}
                >
                  <option value="none">None</option>
                  <option value="Splashdown">Splashdown</option>
                  <option value="CS1010 lecture">CS1010 lecture</option>
                  <option value="CS2040 Tutorial Grp 12">CS2040 Tutorial Grp 12</option>
                </Select>
          </FormControl>
          <br/>
          <label>Image</label>
          <input type="file" onChange={this.handleImageUpload(imageUrl)} />
          <form onSubmit={this.handleSubmit}>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </Fragment>
      ) : this.state.feedType === "question" ? (
        <Fragment>
          <TextField
            name="body"
            type="text"
            label="QUESTION"
            multiline
            rows="3"
            placeholder=" Ask a question"
            error={errors.body ? true : false}
            helperText={errors.body}
            className={classes.textField}
            onChange={this.handleChange}
            fullWidth
          />
          Select tag: 
          <FormControl>
                <Select
                  name="tag"
                  value={this.state.tag}
                  onChange={this.handleChange}
                >
                  <option value="none">None</option>
                  <option value="Splashdown">Splashdown</option>
                  <option value="CS1010 lecture">CS1010 lecture</option>
                  <option value="CS2040 Tutorial Grp 12">CS2040 Tutorial Grp 12</option>
                </Select>
          </FormControl>
          <br/>
          <label>Image</label>
          <input type="file" onChange={this.handleImageUpload} />
          <form onSubmit={this.handleSubmit}>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </Fragment>
      ) : this.state.feedType === "" ? (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleShareClick}
              style={{ width: "100%" }}
            >
              Share something{" "}
            </Button>
            <hr />
          </Grid>

          <Grid item>
            {/* <hr /> */}
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleQnClick}
              style={{ width: "100%" }}
            >
              {" "}
              Ask a Question{" "}
            </Button>
            <hr />
          </Grid>

          <Grid item>
            {/* <hr /> */}
            <Button
              variant="contained"
              onClick={this.handlePollClick}
              style={{ width: "100%" }}
            >
              {" "}
              Create a Poll{" "}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Fragment>
          Create Poll!
          <form onSubmit={this.handleSubmit}>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </Fragment>
      );
    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tip="Post a Feed!">
          <AddIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle style={{fontFamily:"Livvic"}}>Post a new feed</DialogTitle>

          <DialogContent fullWidth>{post}</DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostFeed.propTypes = {
  postFeed: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  data: state.data
});

export default connect(
  mapStateToProps,
  { postFeed, uploadImage, clearErrors }
)(withStyles(styles)(PostFeed));
