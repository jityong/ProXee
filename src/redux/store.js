import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

import userReducer from "./reducers/userReducer";
import dataReducer from "./reducers/dataReducer";
import uiReducer from "./reducers/uiReducer";

const initialState = {};

const middleware = [thunk];

// const persistConfig = {
//   key: "root",
//   storage
// };
const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  UI: uiReducer
});

// const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
// export const persistor = persistStore(store);
// export default () => {
//   return { store, persistor };
// };
export default store; 