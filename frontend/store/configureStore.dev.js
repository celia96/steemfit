import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
}

export const history = createHistory();

const middleware = routerMiddleware(history);
const persistedReducer = persistReducer(persistConfig, rootReducer)


export function configureStore(initialState) {
    return createStore(
        persistedReducer,
        initialState,
        compose(
            applyMiddleware(middleware),
            DevTools.instrument()
        )
    );
}
