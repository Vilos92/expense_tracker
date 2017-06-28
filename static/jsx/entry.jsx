import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';


import root_reducer from './reducers.jsx';
import root_saga from './saga.jsx';

import ReduxAuthContainer from './auth_container.jsx';
import ReduxExpenseListView from './views/expense_list.jsx';
import ReportView from './views/report.jsx';


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
            <ReduxAuthContainer>
                <ReduxExpenseListView />
                <ReportView />
            </ReduxAuthContainer>
        </Provider>
    )   
    ,   
    document.getElementById('react_root')
);
