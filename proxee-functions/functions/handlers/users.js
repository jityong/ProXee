const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // eslint-disable-next-line no-alert
    alert("Signed in user!")
  } else {
    // eslint-disable-next-line no-alert
    alert("No user!")
  }
});

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require("../util/validators");

//signup
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);

  let token, userId;
  return db.doc(`/user/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdTime: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};
exports.observe = (req,res) => {
  return firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // eslint-disable-next-line no-alert
      alert("Signed in user!")
    } else {
      // eslint-disable-next-line no-alert
      alert("No user!")
    }
  });
}
//login
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  
exports.logout = (req,res) => {
  firebase.auth().signOut()
  .then( ()=> {
    console.log("logout success")
    return null;
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).json({ error: err.code });
  });
}
  return firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

//add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//retrieve user details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection('Feed')
          .where('userHandle', '==', req.params.handle)
          // .orderBy('createdTime', 'des)
          .get();
      } else {
        return res.status(404).json({ errror: 'User not found' });
      }
    })
    .then((data) => {
      userData.feed = [];
      data.forEach((doc) => {
        userData.feed.push({
          body: doc.data().body,
          createdTime: doc.data().createdTime,
          userHandle: doc.data().userHandle,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          feedId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//getAuthenticated user
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
      .get()
      // eslint-disable-next-line consistent-return
      .then((doc) => {
        // eslint-disable-next-line promise/always-return
        if (doc.exists) {
          userData.credentials = doc.data();
          return db
            .collection('likes')
            .where('userHandle', '==', req.user.handle)
            .get();
        }
      })
      .then((data) => {
        userData.likes = [];
        data.forEach((doc) => {
          userData.likes.push(doc.data());
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
  });
};

//upload profile image for user
