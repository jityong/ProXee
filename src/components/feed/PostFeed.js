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
import { borders } from "@material-ui/system";
import ReactVote from "react-vote";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";

// Redux stuff
import { connect } from "react-redux";
import { postFeed, clearErrors } from "../../redux/actions/dataActions";

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
    progress: 0
  };
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
      feedType: this.state.feedType
    });
    console.log(this.props.userCoord);
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
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
          <input type="file" />
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
          <Grid item size={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleShareClick}
            >
              Share something{" "}
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleQnClick}
            >
              {" "}
              Ask a Question{" "}
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={this.handlePollClick}>
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
          <DialogTitle>Post a new feed</DialogTitle>

          <DialogContent fullWidth>{post}</DialogContent>
        </Dialog>
        {console.log(this.props.userCoord)}
      </Fragment>
    );
  }
}

PostFeed.propTypes = {
  postFeed: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { postFeed, clearErrors }
)(withStyles(styles)(PostFeed));
