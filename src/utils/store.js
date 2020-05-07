import {createStore, applyMiddleware,compose} from "redux";
import {createLogger} from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";
import storage from 'redux-persist/lib/storage';
import {persistStore, persistReducer} from 'redux-persist'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const logger = createLogger({
    // ...options
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(logger, thunk)));
export const persistor = persistStore(store);



