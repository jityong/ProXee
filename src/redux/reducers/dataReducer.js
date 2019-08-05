import {
  SET_FEEDS,
  LIKE_FEED,
  UNLIKE_FEED,
  LOADING_DATA,
  DELETE_FEED,
  POST_FEED,
  SET_FEED,
  SUBMIT_COMMENT,
  SET_USERDATA
} from "../types";

const initialState = {
  feeds: [],
  feed: {},
  userData: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_FEEDS:
      return {
        ...state,
        feeds: action.payload,
        loading: false
      };
    case SET_FEED:
      return {
        ...state,
        feed: action.payload
      };
    case LIKE_FEED:
    case UNLIKE_FEED:
      let index = state.feeds.findIndex(
        feed => feed.feedId === action.payload.feedId
      );
      state.feeds[index] = action.payload;
      if (state.feed.feedId === action.payload.feedId) {
        state.feed = action.payload;
      }
      return {
        ...state
      };
    case DELETE_FEED:
      index = state.feeds.findIndex(feed => feed.feedId === action.payload);
      state.feeds.splice(index, 1);
      return {
        ...state
      };
    case POST_FEED:
      return {
        ...state,
        feeds: [action.payload, ...state.feeds]
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        feed: {
          ...state.feed,
          comments: [action.payload, ...state.feed.comments]
        }
      };
    case SET_USERDATA:
      return {
        ...state,
        userData: action.payload
      };
    default:
      return state;
  }
}
