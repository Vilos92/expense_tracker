import main_column_style from '~/../scss/main_column.scss';
import utils_style from '~/../scss/utils.scss';


import React from 'react';

import { Switch } from 'react-router';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import { FoundationButton } from '~/components/foundation.jsx';

import ReduxAuthContainer from './auth_container.jsx';
import ReduxExpenseListView from './views/expense_list.jsx';
import ReduxExpenseView from './views/expense.jsx';
import ReportView from './views/report.jsx';


class MainColumn extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="small-8 small-centered columns">
                <div className="main-column">
                    <Link to="/">
                        <FoundationButton>
                            Home
                        </FoundationButton>
                    </Link>

                    <h1>Expense Tracker</h1>

                    {this.props.children}
                </div>
            </div>
        );  
    }
}


export default function AppRouter(props) {
    return (
        <BrowserRouter basename="/app/">
            <MainColumn>
                <Switch>
                    <ReduxAuthContainer>
                        <Route exact path="/" component={ReduxExpenseListView} />
                        <Route exact path="/expense/:expense_id" component={ReduxExpenseView} />
                        <Route exact path="/report" component={ReportView} />
                    </ReduxAuthContainer>
                </Switch>
            </MainColumn>
        </BrowserRouter>
    );
}


