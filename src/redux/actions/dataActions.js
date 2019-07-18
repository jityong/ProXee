import {
    SET_FEEDS,
    LOADING_DATA,
    LIKE_FEED,
    UNLIKE_FEED,
    DELETE_FEED,
    SET_ERRORS,
    POST_FEED,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_FEED,
    STOP_LOADING_UI,
    SUBMIT_COMMENT
  } from '../types';
  import axios from 'axios';
  
  // Get all feeds
  export const getFeeds = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
      .get('/Feed')
      .then((res) => {
        dispatch({
          type: SET_FEEDS,
          payload: res.data
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_FEEDS,
          payload: []
        });
      });
  };
  export const getFeed = (feedId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`/Feed/${feedId}`)
      .then((res) => {
        dispatch({
          type: SET_FEED,
          payload: res.data
        });
        dispatch({ type: STOP_LOADING_UI });
      })
      .catch((err) => console.log(err));
  };
  // Post a feed
  export const postFeed = (newFeed) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
      .post('/Feed', newFeed)
      .then((res) => {
        dispatch({
          type: POST_FEED,
          payload: res.data
        });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };
  // Like a feed
  export const likeFeed = (feedId) => (dispatch) => {
    axios
      .get(`/Feed/${feedId}/like`)
      .then((res) => {
        dispatch({
          type: LIKE_FEED,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };
  // Unlike a feed
  export const unlikeFeed = (feedId) => (dispatch) => {
    axios
      .get(`/Feed/${feedId}/unlike`)
      .then((res) => {
        dispatch({
          type: UNLIKE_FEED,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };
  // Submit a comment
  export const submitComment = (feedId, commentData) => (dispatch) => {
    axios
      .post(`/Feed/${feedId}/comment`, commentData)
      .then((res) => {
        dispatch({
          type: SUBMIT_COMMENT,
          payload: res.data
        });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
      });
  };
  export const deleteFeed = (feedId) => (dispatch) => {
    axios
      .delete(`/Feed/${feedId}`)
      .then(() => {
        dispatch({ type: DELETE_FEED, payload: feedId });
      })
      .catch((err) => console.log(err));
  };
  
  export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        dispatch({
          type: SET_FEEDS,
          payload: res.data.feed
        });
      })
      .catch(() => {
        dispatch({
          type: SET_FEEDS,
          payload: null
        });
      });
  };
  
  export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };
  