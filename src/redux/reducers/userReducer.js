import {
    SET_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_FEED,
    UNLIKE_FEED,
    // MARK_NOTIFICATIONS_READ
  } from '../types';

  const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
  };

  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_AUTHENTICATED:
        return {
          ...state,
          authenticated: true
        };
      case SET_UNAUTHENTICATED:
        return initialState;
      case SET_USER:
        return {
          authenticated: true,
          loading: false,
          ...action.payload
        };
      case LOADING_USER:
        return {
          ...state,
          loading: true
        };
      case LIKE_FEED:
        return {
          ...state,
          likes: [
            ...state.likes,
            {
              userHandle: state.credentials.handle,
              feedId: action.payload.feedId
            }
          ]
        };
      case UNLIKE_FEED:
        return {
          ...state,
          likes: state.likes.filter(
            (like) => like.feedId !== action.payload.feedId
          )
        };
      default:
        return state;
    }
  }