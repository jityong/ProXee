const { db } = require("../util/admin");

exports.getAllFeed = (req, res) => {
  db.collection("Feed")
    .orderBy("createdTime", "desc")
    .get()
    .then(data => {
      let feeds = [];
      data.forEach(doc => {
        feeds.push({
          feedId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdTime: doc.data().createdTime,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return res.json(feeds);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOneFeed = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }
  const newFeed = {
    body: req.body.body,
    userHandle: req.user.handle,
    // userImage: req.user.imageUrl,
    createdTime: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };
  return db
    .collection("Feed")
    .add(newFeed)
    .then(doc => {
      const resFeed = newFeed;
      resFeed.feedId = doc.id;
      return res.json(resFeed);
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

//fetch a feed

exports.getFeed = (req, res) => {
  let feedData = {};
  db.doc(`/Feed/${req.params.feedId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Feed not found" });
      }
      feedData = doc.data();
      feedData.feedId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdTime", "desc")
        .where("feedId", "==", req.params.feedId)
        .get();
    })
    .then(data => {
      feedData.comments = [];
      data.forEach(doc => {
        feedData.comments.push(doc.data());
      });
      return res.json(feedData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//comment on comment
exports.commentOnFeed = (req, res) => {
  if (req.body.body.trim === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdTime: new Date().toISOString(),
    feedId: req.params.feedId,
    userHandle: req.user.handle
  };
  console.log(newComment);
  return db
    .doc(`/Feed/${req.params.feedId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Feed not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

//Like feed
exports.likeFeed = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("feedId", "==", req.params.feedId)
    .limit(1);
  const feedDocument = db.doc(`/Feed/${req.params.feedId}`);
  let feedData;
  feedDocument
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Feed not found" });
      } else {
        feedData = doc.data();
        feedData.feedId = doc.id;
        return likeDocument.get();
      }
    })
    .then(data => {
      if (data.empty) {
        // eslint-disable-next-line promise/no-nesting
        return db
          .collection("likes")
          .add({
            feedId: req.params.feedId,
            userHandle: req.user.handle
          })
          .then(() => {
            feedData.likeCount++;
            return feedDocument.update({ likeCount: feedData.likeCount });
          })
          .then(() => {
            return res.json(feedData);
          });
      } else {
        return res.status(400).json({ error: "Feed already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
//unlike feed
exports.unlikeFeed = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("feedId", "==", req.params.feedId)
    .limit(1);
  const feedDocument = db.doc(`/Feed/${req.params.feedId}`);

  let feedData;
  feedDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        feedData = doc.data();
        feedData.feedId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Feed not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ erorr: "Feed not liked" });
      } else {
        // eslint-disable-next-line promise/no-nesting
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            feedData.likeCount--;
            return feedDocument.update({ likeCount: feedData.likeCount });
          })
          .then(() => res.json(feedData));
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete a feed
exports.deleteFeed = (req, res) => {
  const document = db.doc(`/Feed/${req.params.feedId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Feed not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Feed deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
