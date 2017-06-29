import moment from 'moment';

import React from 'react';
import { connect } from 'react-redux';


class ExpenseListView extends React.Component {
    constructor(props) {
        super(props);

        const timestamp = moment().format('YYYY-MM-DDTHH:mm:ss');

        this.state = {
            timestamp,
            amount: 0.00,
            description: ''
        }

        this.handleClickExpenses = this.handleClickExpenses.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAddExpense = this.handleAddExpense.bind(this);
    }

    componentWillMount() {
        this.props.expenses_request();
    }

    handleClickExpenses() {
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
        if (this.props.expenses) {
            console.log(this.props.expenses);
            expense_items = this.props.expenses.data.map(expense => {
                return <li key={expense.id}>{expense.id}</li>;
            });
        }

        return (
            <div>
                <ul>
                    {expense_items}
                </ul>

                <button onClick={this.handleClickExpenses}>Get Expenses</button>
                <br/>

                <input onChange={this.handleDateChange} type="datetime-local" value={this.state.timestamp} />

                <input onChange={this.handleAmountChange} type="number" 
                    value={this.state.amount} step="0.01" />

                <input onChange={this.handleDescriptionChange} type="text" 
                    value={this.state.description} placeholder="Description" />

                <button onClick={this.handleAddExpense}>Add</button>
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

    return {
        expenses_request,
        expense_submit
    }; 
};

const ReduxExpenseListView = connect(mapStateToProps, mapDispatchToProps)(ExpenseListView);
export default ReduxExpenseListView;
