import moment from 'moment';

import React from 'react';
import { connect } from 'react-redux';

import { FoundationButton } from '~/components/foundation.jsx';
import ExpensePanel from '~/components/expense.jsx';


class ExpenseItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleDeleteExpense = this.handleDeleteExpense.bind(this);
    }

    handleDeleteExpense() {
        const expense_id = this.props.expense.id;

        this.props.expense_delete(expense_id);
    }

    render() {
        const expense = this.props.expense;

        return (
            <ExpensePanel expense={expense} delete_expense={this.handleDeleteExpense} />
        );
    }
}


class ExpenseListView extends React.Component {
    constructor(props) {
        super(props);

        const timestamp = moment().format('YYYY-MM-DDTHH:mm:ss');

        this.state = {
            timestamp,
            amount: 0.00,
            description: ''
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAddExpense = this.handleAddExpense.bind(this);
    }

    componentWillMount() {
        this.props.expenses_request();
    }

    handleDateChange(event) {
        event.preventDefault();
        this.setState({timestamp: event.target.value});
    }

    handleAmountChange(event) {
        event.preventDefault();
        
        if (!event.target.value) {
            return;
        }

        const amount_float = parseFloat(event.target.value);
        const amount = amount_float.toFixed(2);

        this.setState({amount});
    }

    handleAddExpense() {
        this.props.expense_submit(this.state.timestamp, this.state.amount, this.state.description);
    }

    handleDescriptionChange(event) {
        event.preventDefault();
        this.setState({description: event.target.value});
    }

	addExpenseHandler() {
        const amount = 10;
        const description = 'Some description';
    }

    render() {
        let expense_items = null;
        if (this.props.expenses && this.props.expenses.data) {
            const expenses = this.props.expenses.data;

            expense_items = [];

            for (let expense_id in expenses) {
                if (expenses.hasOwnProperty(expense_id)) {
                    const expense = expenses[expense_id];

                    const dt = moment(expense.timestamp);

                    expense_items.push(
                        <ExpenseItem key={expense.id} expense={expense} 
                            expense_delete={this.props.expense_delete} />
                    );
                }
            }
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
                    Add Expense
                </FoundationButton>

                {expense_items}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        expenses: state.expenses,
    };
};

const mapDispatchToProps = (dispatch) => {
    const expenses_request = () => {
        dispatch({
            type: 'EXPENSES_REQUEST',
        });
    };

    const expense_submit = (timestamp, amount, description) => {
        dispatch({
            type: 'EXPENSE_SUBMIT',
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
        expenses_request,
        expense_submit,
        expense_delete
    }; 
};

const ReduxExpenseListView = connect(mapStateToProps, mapDispatchToProps)(ExpenseListView);
export default ReduxExpenseListView;
