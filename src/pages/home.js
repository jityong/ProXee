import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
import Feed from "../components/feed/Feed";
import { Link } from "react-router-dom";
import Logout from "./logout";

// import FeedSkeleton from "../util/FeedSkeleton";

//turf
import * as turf from "@turf/turf";

//redux
import { connect } from "react-redux";
import { getFeeds } from "../redux/actions/dataActions";
import PostFeed from "../components/feed/PostFeed.js";
// var geocoding = new require('reverse-geocoding');

//materialui
import { withStyles } from "@material-ui/styles";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import MoreIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
Geocode.setApiKey("AIzaSyC63MRGstzFKD2AM5kWftjEBGeYZQpFphQ");

const styles = theme => ({
  appBar: {
    top: "auto",
    bottom: 0
  },
  grow: {
    flexGrow: 1
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto"
  }
});

export class home extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      userCoord: { lat: 0, lng: 0 },
      userLoc: "",
      loading: true,
      filter: "Proximity",
      distance: "3",
      Tag: "general"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.getFeeds();
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        this.setState({
          userCoord: { lat: latitude, lng: longitude },
          loading: false
        });
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }
  handleChange(event) {
    const { name, value } = event.target;
    return this.setState({ [name]: value });
  }

  render() {
    const { authenticated } = this.props.user;
    const { classes } = this.props;
    const { feeds, loading } = this.props.data;
    const { lat, lng } = this.state.userCoord;
    // const { feeds, loading } = this.props.data;
    let recentFeedsMarkup = !loading ? (
      this.state.filter === "Proximity" ? (
        feeds
          .filter(feed => {
            const from = turf.point([lng, lat]);
            const to = turf.point([feed.userLoc.lng, feed.userLoc.lat]);
            const options = { units: "kilometers" };
            return turf.distance(from, to, options) < this.state.distance;
          })
          .map(feed => <Feed key={feed.feedId} feed={feed} />)
      ) : (
        feeds.filter(feed => {
          return feed.feedType === this.state.Tag;
        })
      )
    ) : (
      <p>Loading...</p>
    );

    const userAdd = this.state.loading
      ? ""
      : Geocode.fromLatLng(
          this.state.userCoord.lat,
          this.state.userCoord.lng
        ).then(
          response => {
            const address = response.results[0].formatted_address;
            this.setState({ userLoc: address });
          },
          error => {
            console.error(error);
          }
        );

    return (
      <div>
        <Grid container alignItems="center" justify="center" direction="column">
          <Grid item>
            <h1>Current Location: {this.state.userLoc}</h1>
            {/* {this.state.userCoord.lat} {this.state.userCoord.lng} */}
          </Grid>
          <Grid item>
            Filter Feed by:{" "}
            <FormControl>
              <Select
                name="filter"
                value={this.state.filter}
                onChange={this.handleChange}
              >
                <option value="" />
                <option value="Proximity">Proximity</option>
                <option value="Tag">Tag</option>
              </Select>
            </FormControl>
            {this.state.filter === "Proximity" ? (
              <FormControl>
                <Select
                  name="distance"
                  value={this.state.distance}
                  onChange={this.handleChange}
                >
                  <option value="1">1km</option>
                  <option value="3">3km</option>
                  <option value="5">5km</option>
                </Select>
              </FormControl>
            ) : (
              <FormControl>
                <Select
                  name="Tag"
                  value={this.state.Tag}
                  onChange={this.handleChange}
                >
                  <option>-- Choose one --</option>
                  <option value="general">General</option>
                  <option value="question">Question</option>
                  <option value="poll">Poll</option>
                </Select>
              </FormControl>
            )}
            <br />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item sm={7} xs={11}>
            {recentFeedsMarkup}
          </Grid>
        </Grid>
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="Open drawer">
              {authenticated ? (
                <Logout />
              ) : (
                <Button variant="contained">
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    Login/Signup
                  </Link>
                </Button>
              )}
            </IconButton>
            <Fab
              color="secondary"
              aria-label="Add"
              className={classes.fabButton}
            >
              <PostFeed userCoord={this.state.userCoord} />
            </Fab>
            <div className={classes.grow} />
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

home.propTypes = {
  getFeeds: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data,
  user: state.user
});

export default connect(
  mapStateToProps,
  { getFeeds }
)(withStyles(styles)(home));
