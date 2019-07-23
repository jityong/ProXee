import React, { Component } from "react";
// import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeleteFeed from "./DeleteFeed"
// import DeleteFeed from './DeleteFeed';
import CommentDialog from "./CommentDialog";
// import FeedDialog from "./CommentDialog";
import LikeButton from "./LikeButton";
// MUI Stuff
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import Comments from "./Comments";
import { getFeed, clearErrors } from "../../redux/actions/dataActions";

const styles = {
  card: {
    width:"100vw",
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
    position:"center"
  }
};

class Feed extends Component {
  state = {
    open: false,
    comments: []
  };
  // componentDidMount() {
  //   if (this.props.openDialog) {
  //     this.handleOpen();
  //   }
  // }

  // handleOpen = () => {
  //   this.setState({open: true})
  //   this.props.getFeed(this.props.feed.feedId);

  // }
  // handleClose = () => {
  //   this.setState({ open: false });
  //   this.props.clearErrors();
  // }
  // componentDidMount() {
  //   axios
  //     .get("/comments")
  //     .then(res => {
  //       console.log(res.data);
  //       this.setState({
  //         comments: res.data
  //       });
  //     })
  //     .catch(err => console.log(err));
  // }
  render() {
    // const { feed, loading } = this.props.data;
    // console.log(feed.feedId);
    //   let feedComments = !loading ? (
    //     feed.comments.map(comment =>
    //    <div>{comment.body}</div>) ): (
    //       <p>Loading...</p>
    //     )
    dayjs.extend(relativeTime);
    const {
      getFeed,
      classes,
      feed: {
        body,
        createdAt,
        // userImage,
        userHandle,
        feedId,
        likeCount,
        commentCount,
        userLoc,
        comments
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
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {/* {deleteButton} */}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          <LikeButton feedId={feedId} />
          <span>{likeCount} Likes</span>

          <CommentDialog
            feedId={feedId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          >
          </CommentDialog>
          <span>{commentCount} comments</span>
          {deleteButton}
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
