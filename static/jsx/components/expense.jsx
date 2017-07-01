import moment from 'moment';

import React from 'react';
import { Link } from 'react-router-dom';

import Panel from './panel.jsx';
import { FoundationButton } from '~/components/foundation.jsx';


export default function ExpensePanel(props) {
    const expense = props.expense;

    const dt = moment(expense.timestamp);

    const delete_button = (
        <FoundationButton onClick={props.delete_expense}>Delete</FoundationButton>
    );

    return (
        <Panel key={expense.id} onClick={props.onClick}>
            <Link to={`/expense/${expense.id}`}>
                {dt.format()} 
            </Link>
            
            | {expense.amount} | {expense.description} | {delete_button}
        </Panel>
    );
}
