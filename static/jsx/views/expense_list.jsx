import React from 'react';
import { connect } from 'react-redux';


class ExpenseListView extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickExpenses = this.handleClickExpenses.bind(this);
    }

    componentWillMount() {
        this.props.expenses_request();
    }

    handleClickExpenses() {
        this.props.expenses_request();
    }

	addExpenseHandler() {
        const amount = 10;
        const description = 'Some description';
    }

    render() {
        return (
            <div>
                Expenses: {JSON.stringify(this.props.expenses)}<br/>

                <button onClick={this.handleClickExpenses}>Get Expenses</button>
                <br/>

                <input type="date" />
                <input type="text" placeholder="amount" />
                <input type="text" placeholder="description" />
                <button>Add</button>
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

    return {
        expenses_request,
    }; 
};

const ReduxExpenseListView = connect(mapStateToProps, mapDispatchToProps)(ExpenseListView);
export default ReduxExpenseListView;
