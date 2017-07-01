import moment from 'moment';

import React from 'react';
import { connect } from 'react-redux';

import ExpensePanel from '~/components/expense.jsx';


class ReportView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const start_date = this.props.start_date;
        const end_date = this.props.end_date;

        this.props.report_request(start_date, end_date);
    }

    render() {
        const start_date = this.props.start_date;
        const end_date = this.props.end_date;

        let header = 'Report For: All Expenses';
        if (start_date && end_date) {
            header = `Report For: Expenses from ${start_date} through ${end_date}`; 
        }
        else if (start_date) {
            header = `Report For: Expenses after ${start_date}`; 

        } else if (end_date) {
            header = `Report For: Expenses before ${end_date}`; 
        }

        const header_el = <h1>{header}</h1>;

        if (!this.props.report.data.expenses || this.props.report.data.expenses.length == 0) {
            return (
                <div>
                    {header_el}
                    <p>No expenses in this date range.</p>
                </div>
            );
        }

        let expenses = this.props.report.data.expenses;

        expenses.sort((a, b) => {
            return moment(a.timestamp) - moment(b.timestamp)
        });

        let amount_sum = 0.0;
        let expense_items = [];
        for (let i = 0; i < expenses.length; ++i) {
            const expense = expenses[i];

            amount_sum += expense.amount;

            expense_items.push(
                <ExpensePanel key={expense.id} expense={expense} />
            );
        }

        let amount_text;
        if (amount_sum < 0) {
            amount_text = `-$${(-amount_sum).toFixed(2)}`;
        } else {
            amount_text = `$${amount_sum.toFixed(2)}`;
        }

        return (
            <div>
                {header_el}

                <h3>Total Amount: <b>{amount_text}</b></h3>

                {expense_items}
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    const search = ownProps.location.search;
    const params = new URLSearchParams(search);

    const start_date = params.get('start-date');
    const end_date = params.get('end-date');

    return {
        report: state.report,
        start_date,
        end_date
    };
};

const mapDispatchToProps = (dispatch) => {
    const report_request = (start_date, end_date) => {
        dispatch({
            type: 'REPORT_REQUEST',
            start_date,
            end_date
        });
    };

    return {
        report_request,
    };
};

const ReduxReportView = connect(mapStateToProps, mapDispatchToProps)(ReportView);
export default ReduxReportView;
