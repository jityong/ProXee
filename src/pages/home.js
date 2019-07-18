import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
import Feed from "../components/feed/Feed";
// import FeedSkeleton from "../util/FeedSkeleton";

//redux
import { connect } from "react-redux";
import { getFeeds } from "../redux/actions/dataActions";
import PostFeed from "../components/feed/PostFeed.js";
// var geocoding = new require('reverse-geocoding');

Geocode.setApiKey("AIzaSyD_lqsPCD5wB4ziO541YdLV2Ls7ziQTSQA");

export class home extends Component {
  state = {
    userCoord: { lat: 0, lng: 0 },
    userLoc: "",
    loading: true,
  };

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

  render() {
    const { feeds, loading } = this.props.data;
    // const { feeds, loading } = this.props.data;
    let recentFeedsMarkup = !loading ? (
      feeds.map(feed => <Feed key={feed.feedId} feed={feed} />)
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
        <div style={{ textAlign: "center" }}>
          <label>Post a feed!!!</label>
          <PostFeed />
        </div>
        Current Location: {this.state.userLoc} <br/>
        {this.state.userCoord.lat}{" "}
        {this.state.userCoord.lng}
        <Grid container spacing={3}>
          <Grid item sm={8} xs={12}>
            {recentFeedsMarkup}
          </Grid>
        </Grid>
      </div>
    );
  }
}

home.propTypes = {
  getFeeds: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getFeeds }
)(home);
