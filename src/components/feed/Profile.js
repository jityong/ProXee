import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import MyButton from "../../util/MyButton";
// MUI stuff
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";
import { Paper } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import SwipeableViews from "react-swipeable-views";
import Grid from "@material-ui/core/Grid";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
//Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import { getUsersData } from "../../redux/actions/dataActions";
import { useTheme } from "@material-ui/styles";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};
class Profile extends Component {
  state = {
    userOpen: false,
    userDetails: {},
    value: ""
  };
  handleChangeIndex(index) {
    this.setState({ value: index });
  }
  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }
  handleLogout = () => {
    this.props.logoutUser();
  };
  componentDidMount() {
    this.props.getUsersData(this.props.userHandle);
  }
  handleOpen = () => {
    this.setState({ userOpen: true });
  };
  handleClose = () => {
    this.setState({ userOpen: false });
  };
  render() {
    const { userData } = this.props.data;
    const userProfile =
      Object.keys(userData).length === 0 ? (
        <div> Loading ... </div>
      ) : (
        <Fragment>
          Username: {userData.user.handle}
          <hr />
          Email: {userData.user.email}
          <hr />
          Website: {userData.user.website}
        </Fragment>
      );
    return (
      <div>
        <Button onClick={this.handleOpen}> {this.props.userHandle} </Button>
        <Dialog open={this.state.userOpen} onClose={this.handleClose}>
          <DialogContent>
            {userProfile}
            {console.log(userData)}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  data: state.data
});

const mapActionsToProps = { logoutUser, getUsersData };

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  userHandle: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Profile);
