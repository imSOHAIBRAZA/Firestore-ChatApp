import {combineReducers} from "redux";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import threadReducer from "./threadReducer";
import navReducer from "./navigationReducer";
import storage from 'redux-persist/lib/storage';
import {persistReducer} from 'redux-persist'

const authPersistConfig = {
    key: 'auth',
    storage: storage,
    blacklist: ['contacts']
};
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    chats: chatReducer,
    thread: threadReducer,
    nav: navReducer

});

export default rootReducer;
