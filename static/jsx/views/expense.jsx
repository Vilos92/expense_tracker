import moment from 'moment';

import React from 'react';
import { connect } from 'react-redux';

import { FoundationButton } from '~/components/foundation.jsx';
import ExpensePanel from '~/components/expense.jsx';


class ExpenseView extends React.Component {
    constructor(props) {
        super(props);

        let dt;
        let amount;
        let description;

        if (props.expense) {
            dt = moment(props.expense.timestamp);
            amount = props.expense.amount;
            description = props.expense.description;
        } else {
            dt = moment();
            amount = '0.00';
            description = '';
        }

        const timestamp = dt.format('YYYY-MM-DDTHH:mm:ss');

        this.state = {
            timestamp,
            amount,
            description
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleUpdateExpense = this.handleUpdateExpense.bind(this);
        this.handleDeleteExpense = this.handleDeleteExpense.bind(this);
    }

    componentWillMount() {
        if (!this.props.expense_id) {
            return;
        }

        const expense_id = this.props.expense_id;

        this.props.expense_request(expense_id);
    }

	componentWillReceiveProps(nextProps) {
		if (nextProps.expense !== this.props.expense) {
            const dt = moment(nextProps.expense.timestamp);
            const timestamp = dt.format('YYYY-MM-DDTHH:mm:ss');

            this.setState({timestamp});
		}
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

    handleUpdateExpense() {
        this.props.expense_update(this.props.expense_id, this.state.timestamp,
                this.state.amount, this.state.description);
    }

    handleDescriptionChange(event) {
        event.preventDefault();
        this.setState({description: event.target.value});
    }

    handleDeleteExpense() {
        const expense_id = this.props.expense_id;

        this.props.expense_delete(expense_id);

        this.props.history.push('/');
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

                <FoundationButton onClick={this.handleUpdateExpense}
                                large={true} expanded={true}>
                    Update Expense
                </FoundationButton>

                <ExpensePanel expense={expense} />

                <FoundationButton onClick={this.handleDeleteExpense}
                                large={true} expanded={true}>
                    Delete Expense
                </FoundationButton>
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

    const expense_update = (expense_id, timestamp, amount, description) => {
        dispatch({
            type: 'EXPENSE_UPDATE',
            expense_id,
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
