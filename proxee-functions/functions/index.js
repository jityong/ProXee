const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/FBAuth');

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin')

const {
    getAllFeed,
    postOneFeed,
    getFeed,
    commentOnFeed,
    likeFeed,
    unlikeFeed,
    deleteFeed,
    uploadImage,
    getImageUrl,
    getTags,
    postTag
} = require ('./handlers/Feed');

const { 
    signup,
    login,
    getAuthenticatedUser,
    getUserDetails,
    addUserDetails,
    
} = require ('./handlers/users');

//Feed routes
app.get('/getTags', getTags);
app.post('/postTag', postTag);
app.get('/Feed', getAllFeed);
app.post('/Feed',FBAuth, postOneFeed);
app.get('/Feed/:feedId', getFeed);
app.delete('/Feed/:feedId', FBAuth, deleteFeed);
app.get('/Feed/:feedId/like', FBAuth, likeFeed);
app.get('/Feed/:feedId/unlike', FBAuth,unlikeFeed);
app.post('/Feed/:feedId/comment', FBAuth, commentOnFeed);
app.post('/Feed/image', uploadImage);
app.get('/getImageUrl',getImageUrl);
//users routes

app.post('/signup', signup);
app.post('/login', login);

app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
// app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('asia-east2').https.onRequest(app);

exports.onFeedDelete = functions
  .region('asia-east2')
  .firestore.document('/Feed/{feedId}')
  .onDelete((snapshot, context) => {
    const feedId = context.params.feedId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('feedId', '==', feedId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('feedId', '==', feedId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('feedId', '==', feedId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
});