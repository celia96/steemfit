import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

import userReducer from './user';
import profileReducer from './profile';
import commentDetailReducer from './commentDetail';
import modalReducer from './modal';

const rootReducer = combineReducers({
    userReducer,
    profileReducer,
    modalReducer,
    commentDetailReducer,
    routing
});

export default rootReducer;
