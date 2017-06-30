import foundation_style from '~/../css/foundation.min.css';

import utils_style from '~/../scss/utils.scss';
import foundation_restyled from '~/../scss/foundation.scss';


import React from 'react';


export function FoundationDropDown(props) {
    const selected_value = props.value;

    const options = props.rows.map((row) => {
        const value = row.value;
        const text = row.text;

        return (
            <option key={value} value={value}>
                {text}
            </option>
        );
    });

	return (
		<label>{props.label}
			<select value={selected_value} onChange={props.onChange}>
                <option value="">Select Exercise...</option>
                {options}
			</select>
		</label>
	);
}


const button_colors = [
    'success',
    'secondary',
    'alert',
    'info',
    'disabled'
];

export function FoundationButton(props) {
    let classes = ['button'];

    if (button_colors.includes(props.button_color)) {
        classes.push(props.button_color);
    }

    if (props.large) {
        classes.push('large');
    }

    if (props.expanded) {
        classes.push('expanded');
    }

    if (props.class_name) {
        classes.push(props.class_name);
    }

    const class_name = classes.join(' ');

    return (
        <button className={class_name} onClick={props.onClick}>
            {props.children}
        </button> 
    );
}


export function FoundationButtonGroup(props) {
    return (
        <div className="button-group">
            {props.children}
        </div>
    );
}


export function FoundationInputGroup(props) {
    return (
        <div className="input-group">
            {props.children}
        </div>
    );
}


export function FoundationInputGroupLabel(props) {
    let classes = ['input-group-label'];

    if (props.class_name) {
        classes.push(props.class_name);
    }

    const class_name = classes.join(' ');

    return (
        <span className={class_name}>
            {props.children}
        </span>
    );
}


export function FoundationInputGroupButton(props) {
    let classes = ['input-group-button'];

    if (props.class_name) {
        classes.push(props.class_name);
    }

    const class_name = classes.join(' ');

    return (
        <div className={class_name}>
            {props.children}
        </div>
    );
}


export class FoundationInputGroupNumberField extends React.Component {
    constructor(props) {
        super(props);

        this.handleNumberChange = this.handleNumberChange.bind(this);
    }

    handleNumberChange(event) {
        event.preventDefault();

        this.props.handleNumberChange(event.target.value);
    }

    render() {
        let classes = ['input-group-field'];

        if (this.props.no_spinners === true) {
            classes.push('no-spinners');
        }

        if (this.props.class_name) {
            classes.push(this.props.class_name);
        }

        const class_name = classes.join(' ');

        return (
            <input className={class_name} type="number" value={this.props.number}
                onChange={this.handleNumberChange} />
        );
    }

}


const close_button_sizes = [
    'lg',
    '2x',
    '3x',
    '4x',
    '5x'
];

export function FoundationCloseButton(props) {
    let classes = ['close-button'];

    if (props.float_right) {
        classes.push('float-right');
    }

    if (close_button_sizes.includes(props.size)) {
        const font_class = `font-${props.size}`;
        classes.push(font_class);
    }

    const class_name = classes.join(' ');

    return (
        <button className={class_name} onClick={props.onClick}
                aria-label="Close alert" type="button">
            <span aria-hidden="true">&times;</span>
        </button> 
    );
}
