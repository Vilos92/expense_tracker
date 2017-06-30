import normalize_style from '~/../css/normalize.css';
import foundation_style from '~/../css/foundation.min.css';

import style from '~/../scss/style.scss';
import main_column_style from '~/../scss/main_column.scss';


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


export function MainColumn(props) {
    return (
        <div className="small-8 small-centered columns">
            <div className="main-column">
                <h1>Expense Tracker</h1>

                {props.children}
            </div>
        </div>
    );  
}


                //<ReportView />


ReactDOM.render((
        <Provider store={store}>
            <MainColumn>
                <ReduxAuthContainer>
                    <ReduxExpenseListView />
                </ReduxAuthContainer>
            </MainColumn>
        </Provider>
    )   
    ,   
    document.getElementById('react_root')
);
