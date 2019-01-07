import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HashRouter as Router, Route } from 'react-router-dom';

import AppContainer from './AppContainer.js';

export default function Root({ store, persistor }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Route path="/" component={AppContainer}/>
                </Router>
            </PersistGate>
        </Provider>
    );
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};
