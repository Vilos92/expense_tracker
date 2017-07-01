import React from 'react';
import { connect } from 'react-redux';

import { FoundationButton } from '~/components/foundation.jsx';
import ExpensePanel from '~/components/expense.jsx';


class ExpenseView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    componentWillMount() {
        const expense_id = this.props.expense_id;

        this.props.expense_request(expense_id);
    }

    render() {
        const expense = this.props.expense;

        if (!expense) {
            return <div>Expense not available.</div>;
        }

        return (
            <div>
                <input onChange={this.handleDateChange} type="datetime-local" value={this.state.timestamp} />

                <input onChange={this.handleAmountChange} type="number" 
                    value={this.state.amount} step="0.01" />

                <input onChange={this.handleDescriptionChange} type="text" 
                    value={this.state.description} placeholder="Description" />

                <FoundationButton onClick={this.handleAddExpense}
                                large={true} expanded={true}>
                    Update Expense
                </FoundationButton>

                <ExpensePanel expense={expense} />
            </div>

        );
    }
}


const mapStateToProps = (state, ownProps) => {
    let expense_id;
    if (ownProps.match) {
        const params = ownProps.match.params;
        expense_id = params.expense_id;
    }

    const expenses = state.expenses.data;

    let expense = null;
    if (expenses.hasOwnProperty(expense_id)) {
        expense = expenses[expense_id];
    }

    return {
        expense_id,
        expense
    };
};

const mapDispatchToProps = (dispatch) => {
    const expense_request = (expense_id) => {
        dispatch({
            type: 'EXPENSE_REQUEST',
            expense_id
        });
    };

    const expense_update = (timestamp, amount, description) => {
        dispatch({
            type: 'EXPENSE_UPDATE',
            timestamp,
            amount,
            description
        });
    };

    const expense_delete = (expense_id) => {
        dispatch({
            type: 'EXPENSE_DELETE',
            expense_id
        });
    };

    return {
        expense_request,
        expense_update,
        expense_delete
    }; 
};

const ReduxExpenseView = connect(mapStateToProps, mapDispatchToProps)(ExpenseView);
export default ReduxExpenseView;
