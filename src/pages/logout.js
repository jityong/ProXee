import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import PropTypes from "prop-types";
// import AppIcon from '../images/icon.png';
import { Link } from "react-router-dom";

// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// Redux stuff
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/userActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

const styles = theme => ({
  ...theme
});

class logout extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleClick = event => {
    event.preventDefault();

    this.props.logoutUser();
  };
  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };
  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { open } = this.state;

    return (
      <Grid>
        <Button variant="contained" onClick={this.handleToggle}>
          Logout
        </Button>
        <Dialog open={open}>
          <DialogContent>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>Confirm logout?</Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={this.handleClick}>
                  Yes
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }
}

logout.propTypes = {
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  logoutUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(logout));
