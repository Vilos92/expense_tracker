import React from 'react';


export default class ReportView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const access_token = this.props.access_token;

        /*
        fetch('/api/report', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error('Network response was not ok.');
        })
        .then(json => {
            console.log(json);
            const expenses = json.report.expenses;
            console.log(expenses);
        }).
        catch(error => {
            console.log(error.message);
        });
        */
    }

    render() {
        return (
            <div>
                Reports!
            </div>
        );
    }
}
