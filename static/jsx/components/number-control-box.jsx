import number_control_box_style from '~/../scss/number_control_box.scss';


import React from 'react';

import { FoundationInputGroup, FoundationInputGroupLabel, FoundationInputGroupButton,
    FoundationInputGroupNumberField } from '~/components/foundation.jsx';
import IconButton from '~/components/icon-button.jsx';


function NumberControlBoxLabel(props) {
    return (
        <FoundationInputGroupLabel class_name="number-control-box-input-group-label">
            {props.children}
        </FoundationInputGroupLabel>
    );
}


function NumberControlBoxField(props) {
    return (
        <FoundationInputGroupNumberField number={props.number} no_spinners={true}
            handleNumberChange={props.handleNumberChange}
            class_name="number-control-box-field" />
    );
}


function NumberControlBoxButton(props) {
    const input_group_button_class = 'number-control-box-input-group-button';
    const button_class = 'number-control-box-button';

    return (
        <FoundationInputGroupButton class_name={input_group_button_class}>
            <IconButton onClick={props.onClick} icon_class={props.icon_class} 
                button_class={button_class} />
        </FoundationInputGroupButton>
    );
}


export default class NumberControlBox extends React.Component {
    /**
     *  Contains a number field, with button controls to
     *  increase or decrease the value 
     */
    constructor(props) {
        super(props);

        this.setNumber = this.setNumber.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleClickMinus = this.handleClickMinus.bind(this);
        this.handleClickPlus = this.handleClickPlus.bind(this);
    }

    setNumber(number) {
        this.props.setNumber(number);
    }

    handleNumberChange(new_number) {
        let number = this.props.number;

        if (!new_number) {
            number = 0;
        } else if (new_number > 0 ) {
            number = new_number;
        }

        this.setNumber(number);
    }

    handleClickMinus() {
        const old_number = this.props.number;

        const increment_size = 5;
        const increment_count = (old_number - 1) / increment_size;

        let number = 0;
        if (increment_count > 0) {
            number = Math.floor(increment_count) * increment_size;
        }

        this.setNumber(number);
    }

    handleClickPlus() {
        const old_number = this.props.number;

        const increment_size = 5;
        const number = Math.ceil((old_number + 1) / increment_size) * increment_size;

        this.setNumber(number);
    }

    render() {
        const label = this.props.label;
        const number = this.props.number;

        return (
            <FoundationInputGroup>
                <NumberControlBoxLabel>{label}</NumberControlBoxLabel>

                <NumberControlBoxField number={number} no_spinners={true}
                    handleNumberChange={this.handleNumberChange} />

                <NumberControlBoxButton onClick={this.handleClickMinus} icon_class="minus" />
                <NumberControlBoxButton onClick={this.handleClickPlus} icon_class="plus" />
            </FoundationInputGroup>
        );
    }
}
