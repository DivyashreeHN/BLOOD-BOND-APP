import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Change the import to use named export
import profileReducer from "../reducers/profileReducer";
import bloodbankReducer from "../reducers/bloodbankReducer";

const configureStore = () => {
  const store = createStore(
    combineReducers({
      profiles: profileReducer,
      bloodbanks: bloodbankReducer,
    }),
    applyMiddleware(thunk)
  );
  return store;
};

export default configureStore;
