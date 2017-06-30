import dropdown_style from '~/../scss/drop_down_menu.scss';


import React from 'react';

import Dropdown from 'react-simple-dropdown';
import { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

import FontAwesomeIcon from './font-awesome.jsx'; 


function DropDownMenuRow(props) {
    return (
        <li onClick={props.onClick}>
            {props.children}
        </li>
    );
}


export default class DropDownMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleRowClick = this.handleRowClick.bind(this);
    }

    handleRowClick() {
        this.refs.dropdown.hide();  // Would normally lift state up, but Dropdown already has
    }                               // built-in methods (including hide when clicking outside)

    render() {
        let container_class = "dropdown-container";
        if (this.props.className) {
            container_class += ` ${this.props.className}`;
        }

        let secondary_text_row = null;
        if (this.props.secondary_text) {
            secondary_text_row = (
                <div className="dropdown-row">
                    {this.props.secondary_text}
                </div>
            );
        }

        let key = 0;
        const rows = this.props.values.map(value => (
            <DropDownMenuRow key={key++} onClick={this.handleRowClick}>
                {value}
            </DropDownMenuRow>
        ));

        return (
            <div className={container_class}>
                <Dropdown ref="dropdown">
                    <DropdownTrigger>
                        {this.props.main_text} <FontAwesomeIcon icon_class="caret-down" />
                    </DropdownTrigger>

                    <DropdownContent>
                        {secondary_text_row}

                        <ul>
                            {rows}
                        </ul>
                    </DropdownContent>
                </Dropdown> 
            </div>
        );
    }
}
