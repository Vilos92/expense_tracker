import React from 'react';
import { connect } from 'react-redux';


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

        let header = 'All Expenses';
        if (start_date && end_date) {
            header = `Expenses from ${start_date} through ${end_date}`; 
        }
        else if (start_date) {
            header = `Expenses after ${start_date}`; 

        } else if (end_date) {
            header = `Expenses before ${end_date}`; 
        }

        const header_el = <h3>{header}</h3>;

        if (!this.props.report.data.expenses || this.props.report.data.expenses.length == 0) {
            return (
                <div>
                    {header_el}
                    <p>No expenses in this date range.</p>
                </div>
            );
        }

        return (
            <div>
                {header_el}

                Reports!
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
