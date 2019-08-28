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
import Chip from "@material-ui/core/Chip";
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
      filter: "feedType",
      distance: "3",
      feedType: "none",
      tag: "none"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDistDelete = this.handleDistDelete.bind(this);
    this.handleFeedTypeDelete = this.handleFeedTypeDelete.bind(this);
    this.handleTagDelete = this.handleTagDelete.bind(this);

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
  handleDistDelete() {
    return this.setState({ distance: "100" });
  }
  handleFeedTypeDelete() {
    return this.setState({ feedType: "none" });
  }
  handleTagDelete() {
    return this.setState({ tag: "none" });
  }

  render() {
    const { authenticated } = this.props.user;
    const { classes } = this.props;
    const { feeds, loading } = this.props.data;
    const { lat, lng } = this.state.userCoord;
    let tags = [];
    let recentFeedsMarkup = !loading ? (
      feeds
        .filter(feed => {
          const from = turf.point([lng, lat]);
          const to = turf.point([feed.userLoc.lng, feed.userLoc.lat]);
          const options = { units: "kilometers" };
          const distanceBool =
            turf.distance(from, to, options) < this.state.distance;
          let feedTypeBool = true;
          this.state.feedType !== "none"
            ? (feedTypeBool = feed.feedType === this.state.feedType)
            : (feedTypeBool = true);
          let tagBool = true;
          this.state.tag !== "none"
            ? (tagBool = feed.tag === this.state.tag)
            : (tagBool = true);
          let a = false;
          // tags.includes(feed.tag) ? (a = true) : (tags.push(feed.tag));

          return distanceBool && feedTypeBool && tagBool;
        })
        .map(feed => <Feed key={feed.feedId} feed={feed} />)
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
                <option value="feedType">Feed Types</option>
                <option value="tag">Tags</option>
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
            ) : this.state.filter === "feedType" ? (
              <FormControl>
                <Select
                  name="feedType"
                  value={this.state.feedType}
                  onChange={this.handleChange}
                >
                  <option value="none">None</option>
                  <option value="general">General</option>
                  <option value="question">Question</option>
                  <option value="poll">Poll</option>
                </Select>
              </FormControl>
            ) : (
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
            )}
            <br />
          </Grid>
        </Grid>
        {this.state.distance != "100" ? (
        <Chip
          label={"Distance =>" + this.state.distance + "km"}
          onDelete={this.handleDistDelete}
          className={classes.chip}
          
        />
        ):(console.log(''))}
        {this.state.feedType !== "none" ? (
          <Chip
            label={"Feed Type => " + this.state.feedType}
            onDelete={this.handleFeedTypeDelete}
            className={classes.chip}
            color="primary"
          />
        ) : (
          console.log("")
        )}

        {this.state.tag !== "none" ? (
          <Chip
            label={"Tag => " + this.state.tag}
            onDelete={this.handleTagDelete}
            className={classes.chip}
            color="secondary"
          />
        ) : (
          console.log("")
        )}
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
            <IconButton color="inherit">{/* <SearchIcon /> */}</IconButton>
            <IconButton edge="end" color="inherit">
              {/* <MoreIcon /> */}
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
