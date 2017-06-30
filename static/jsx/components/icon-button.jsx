import FontAwesomeIcon from '~/components/font-awesome.jsx';
import { FoundationButton } from '~/components/foundation.jsx';

import React from 'react';


export default function IconButton(props) {
    const icon_class = props.icon_class;
    const icon_size = props.icon_size;

    return (
        <FoundationButton onClick={props.onClick} button_color={props.button_color}
                large={props.large} expanded={props.expanded}
                class_name={props.button_class}>
            <FontAwesomeIcon icon_class={icon_class} icon_size={icon_size} /> {props.children}
        </FoundationButton>
    );
}
