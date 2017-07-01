import moment from 'moment';

import React from 'react';
import { Link } from 'react-router-dom';
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
            amount: '0.00',
            description: '',
            start_date: '',
            end_date: ''
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAddExpense = this.handleAddExpense.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleClearDateFilter = this.handleClearDateFilter.bind(this);
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

    handleDescriptionChange(event) {
        event.preventDefault();
        this.setState({description: event.target.value});
    }

    handleAddExpense() {
        this.props.expense_submit(this.state.timestamp, this.state.amount, this.state.description);
    }


    handleStartDateChange(event) {
        event.preventDefault();
        this.setState({start_date: event.target.value});
    }

    handleEndDateChange(event) {
        event.preventDefault();
        this.setState({end_date: event.target.value});
    }

    handleClearDateFilter() {
        this.setState({
            start_date: '',
            end_date: ''
        });

    }

    render() {
        let expense_items = null;
        if (this.props.expenses && this.props.expenses.data) {
            const expenses = this.props.expenses.data;

            let start_dt = null;
            if (this.state.start_date) {
                start_dt = moment(this.state.start_date);
            }

            let end_dt = null;
            if (this.state.end_date) {
                end_dt = moment(this.state.end_date);
            }


            let expense_list = [];
            for (let expense_id in expenses) {
                if (expenses.hasOwnProperty(expense_id)) {
                    let expense = expenses[expense_id];
                    expense.timestamp = moment(expense.timestamp);
                    
                    if (start_dt && expense.timestamp < start_dt) {
                        continue;
                    }

                    if (end_dt && expense.timestamp < end_dt) {
                        continue;
                    }

                    expense_list.push(expense);
                }
            }

            expense_list.sort((a, b) => {
                return a.timestamp - b.timestamp;
            });

            expense_items = [];
            for (let i = 0; i < expense_list.length; ++i) {
                const expense = expense_list[i];

                expense_items.push(
                    <ExpenseItem key={expense.id} expense={expense} 
                        expense_delete={this.props.expense_delete} />
                );
            }
        }

        const start_date = this.state.start_date;
        const end_date = this.state.end_date;

        let report_link = '/report';
        if (start_date && end_date) {

            report_link = `${report_link}?start-date=${start_date}&end-date=${end_date}`;
        }
        else if (start_date) {
            const start_date = this.state.start_date;

            report_link = `${report_link}?start-date=${start_date}`;
        } else if (end_date) {

            report_link = `${report_link}?end-date=${end_date}`;
        }

        return (
            <div>
                <h3>Create New Expense</h3>

                <label>Time and Date</label>
                <input onChange={this.handleDateChange} type="datetime-local" value={this.state.timestamp} />

                <label>Amount</label>
                <input onChange={this.handleAmountChange} type="number" 
                    value={this.state.amount} step="0.01" />

                <label>Description</label>
                <input onChange={this.handleDescriptionChange} type="text" 
                    value={this.state.description} placeholder="Description" />

                <FoundationButton onClick={this.handleAddExpense}
                                large={true} expanded={true}>
                    Add Expense
                </FoundationButton>

                <hr></hr>

                <h3>Existing Expenses</h3>

                <label htmlFor="start-date-filter">Start Date</label>
                <input id="start-date-filter" type="date"
                    value={this.state.start_date} onChange={this.handleStartDateChange} />

                <label htmlFor="end-date-filter">End Date</label>
                <input id="end-date-filter" type="date"
                    value={this.state.end_date} onChange={this.handleEndDateChange} />

                <FoundationButton onClick={this.handleClearDateFilter}
                        large={true}>
                    Clear Date Filter
                </FoundationButton>

                <div className="float-right">
                    <Link to={report_link}>
                        <FoundationButton large={true}>
                            View Report 
                        </FoundationButton>
                    </Link>
                </div>

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
