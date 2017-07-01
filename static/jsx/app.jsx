import main_column_style from '~/../scss/main_column.scss';


import React from 'react';

import { Switch } from 'react-router';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import { FoundationButton } from '~/components/foundation.jsx';

import ReduxAuthContainer from './auth_container.jsx';
import ReduxExpenseListView from './views/expense_list.jsx';
import ReduxExpenseView from './views/expense.jsx';
import ReportView from './views/report.jsx';


function MainColumn(props) {
    return (
        <div className="small-8 small-centered columns">
            <div className="main-column">
                <Link to="/">
                    <FoundationButton>
                        Home
                    </FoundationButton>
                </Link>

                <h1>Expense Tracker</h1>

                {props.children}
            </div>
        </div>
    );  
}


export default function AppRouter(props) {
    return (
        <BrowserRouter basename="/app/">
            <MainColumn>
                <Switch>
                    <ReduxAuthContainer>
                            <Route exact path="/" component={ReduxExpenseListView} />
                            <Route path="/expense/:expense_id" component={ReduxExpenseView} />
                            <Route path="/report" component={ReportView} />
                    </ReduxAuthContainer>
                </Switch>
            </MainColumn>
        </BrowserRouter>
    );
}


