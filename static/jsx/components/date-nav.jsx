import React from 'react';

import { Link } from 'react-router-dom';

import IconButton from '~/components/icon-button.jsx';


function get_previous_timestamp(date) {
    const date_copy = date.clone();
    date_copy.subtract(1, 'days');
    return date_copy.format();
}


function get_next_timestamp(date) {
    const date_copy = date.clone();
    date_copy.add(1, 'days')
    return date_copy.format();
}


function get_surrounding_timestamps(date) {
    /**
     *  Return the timestamp of the previous and following days
     */
    const prev_date_str = get_previous_timestamp(date);
    const next_date_str = get_next_timestamp(date);

    return [prev_date_str, next_date_str];
}


export default class DateNav extends React.Component {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(event) {
        const key_code = event.keyCode;

        switch(key_code) {
            case 37:
                const prev_date_str = get_previous_timestamp(this.props.date);
                this.props.history.push(`/${prev_date_str}`);
                break;
            case 39:
                const next_date_str = get_next_timestamp(this.props.date);
                this.props.history.push(`/${next_date_str}`);
                break;
        }
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    render() {
        const date = this.props.date.clone();
        const current_date_str = date.format('dddd, MMMM Do, YYYY');

        const surrounding_timestamps = get_surrounding_timestamps(date);
        const prev_date_str = surrounding_timestamps[0];
        const next_date_str = surrounding_timestamps[1];

        return (
            <div className="date-nav-container">
                <Link to={`/${prev_date_str}`}>
                    <IconButton icon_class="chevron-left" icon_size="3x" />
                </Link>

                <div className="date-nav-header">
                    {current_date_str}
                </div>

                <Link to={`/${next_date_str}`}>
                    <IconButton icon_class="chevron-right" icon_size="3x" />
                </Link>
            </div>
        );
    }
}
