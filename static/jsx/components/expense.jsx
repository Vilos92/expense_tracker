import moment from 'moment';

import React from 'react';
import { Link } from 'react-router-dom';

import Panel from './panel.jsx';
import { FoundationButton } from '~/components/foundation.jsx';


export default function ExpensePanel(props) {
    const expense = props.expense;

    const dt = moment(expense.timestamp);
    const dt_str = dt.format("dddd, MMMM Do YYYY, h:mm:ss a");

    let header = <h4>{dt_str}</h4>;

    let delete_button = null;
    if (props.delete_expense) {
        delete_button = (
            <FoundationButton onClick={props.delete_expense}>Delete</FoundationButton>
        );

        header = (
            <Link to={`/expense/${expense.id}`}>
                {header}
            </Link>
        );
    }

    return (
        <Panel key={expense.id} onClick={props.onClick}>
            {header}
            
            <h5>${expense.amount.toFixed(2)}</h5>

            <p>{expense.description}</p>

            {delete_button}
        </Panel>
    );
}
