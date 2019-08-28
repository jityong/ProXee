import React, { Component, Fragment } from "react";
// import withStyles from '@material-ui/core/styles/withStyles';
// import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
// import MyButton from "../../util/MyButton";
import DeleteFeed from "./DeleteFeed";
import Profile from "./Profile";
// import DeleteFeed from './DeleteFeed';
import CommentDialog from "./CommentDialog";
// import FeedDialog from "./CommentDialog";
import LikeButton from "./LikeButton";
// MUI Stuff
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Dialog from "@material-ui/core/Dialog";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
// import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
// import { ThemeProvider } from "@material-ui/styles";
// import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

// Icons
// import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
// import Comments from "./Comments";
import { getFeed, clearErrors } from "../../redux/actions/dataActions";
import { Grid } from "@material-ui/core";

const styles = {
  card: {
    width: "100vw",
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  // image: {
  //   minWidth: 200
  // },
  content: {
    padding: 25,
    objectFit: "cover",
    position: "center"
  },
  sharing: {
    fontWeight: 600,
    fontStyle: "italic",
    color: "white",
    backgroundColor: "green"
  },
  question: {
    fontWeight: 600,
    fontStyle: "italic",
    color: "white",
    backgroundColor: "red"
  },
  poll: {
    fontWeight: 600,
    fontStyle: "italic",
    color: "white",
    backgroundColor: "purple"
  }
};

class Feed extends Component {
  
  state = {
    open: false,
    userOpen: false,
    comments: [],
    temp: true
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      // getFeed,
      classes,
      feed: {
        body,
        createdAt,
        imageUrl,
        userHandle,
        feedId,
        likeCount,
        commentCount,
        // userLoc,
        // comments,
        feedType,
        tag
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteFeed feedId={feedId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content} style={{width:"100%"}}>
          <Grid container direction="row" justify="space-between"style={{ width: "100%" }}>
            <Grid item>
              <Profile userHandle={userHandle} />
              {/* User Profile */}
            </Grid>
            <Grid item>{deleteButton}</Grid>
          </Grid>
          {feedType === "general" ? (
            <span variant="body2" className={classes.sharing}>
              #general
            </span>
          ) : feedType === "question" ? (
            <span variant="body2" className={classes.question}>
              #question
            </span>
          ) : (
            <span variant="body2" className={classes.poll}>
              #poll
            </span>
          )}
          {"  "}
          {tag !== "none"?  <span className={classes.poll}>
            #{tag}
          </span> : (console.log(''))}
         
        
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {imageUrl !== "" ? (
            <img src={imageUrl} alt="by user" width="100%" />
          ) : (
            <div />
          )}

          <LikeButton feedId={feedId} />
          <span>{likeCount} Likes</span>

          <CommentDialog
            feedId={feedId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
          <span>{commentCount} comments</span>
        </CardContent>
      </Card>
    );
  }
}

Feed.propTypes = {
  getFeed: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  feed: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user,
  data: state.data
});
const mapActionsToProps = {
  getFeed,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Feed));
