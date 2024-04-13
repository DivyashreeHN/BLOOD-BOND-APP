import {createStore,combineReducers,applyMiddleware} from "redux"
import {thunk} from "redux-thunk"
import profileReducer from "../reducers/profileReducer"
const configureStore=()=>
{
    const store =createStore(combineReducers({
        profiles:profileReducer

    }),applyMiddleware  (thunk))
    return store
}
export default configureStore