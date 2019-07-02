import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import App from './components/App';
import reducers from './reducers';
import middleware from './middleware';
import initialState from './initialState';

const rootElement = document.getElementById('app');
const store = createStore(reducers, initialState, middleware);

render(
    <Provider store={store}>
        <App />
    </Provider>, 
    rootElement);
