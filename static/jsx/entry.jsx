import normalize_style from '~/../css/normalize.css';
import foundation_style from '~/../css/foundation.min.css';

import style from '~/../scss/style.scss';


import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import root_reducer from './reducers.jsx';
import root_saga from './saga.jsx';

import AppRouter from './app.jsx';


const logger_middleware = createLogger({
    collapsed: true
});

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    root_reducer,
    applyMiddleware(
        sagaMiddleware,
        logger_middleware
    )
)

sagaMiddleware.run(root_saga);

ReactDOM.render((
        <Provider store={store}>
            <AppRouter />
        </Provider>
    )   
    ,   
    document.getElementById('react_root')
);
