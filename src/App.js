import React, { Component, Fragment } from 'react';
import "./App.css";
//React router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from 'jwt-decode';

//React-Redux
import { Provider } from "react-redux";
import store from "./redux/store";
// import persistor from "./redux/store";
import { logoutUser, getUserData } from './redux/actions/userActions';
import { SET_AUTHENTICATED } from './redux/types';
// import { PersistGate } from "redux-persist/lib/integration/react";

//pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

//axios
import axios from "axios";

// axios.defaults.baseURL =
//   'https://asia-east2-proxee-3a609.cloudfunctions.net/api ';

  const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
 
  render() {
    return (
      <Provider store={store}>
        {/* <PersistGate persistor={store.persistor}> */}
          <Router>
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>
        {/* </PersistGate> */}
      </Provider>
    );
  }
}

export default App;
