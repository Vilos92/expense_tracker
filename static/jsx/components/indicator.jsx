import indicator_style from '~/../scss/indicator.scss';


import React from 'react';

import FontAwesomeIcon from './font-awesome.jsx'; 
import Panel from './panel.jsx'; 


export function ContentEmptyIndicator(props) {
    return (
        <div className="indicator">
            <FontAwesomeIcon icon_class="tree" icon_size="5x" />
            <h3>{props.children}</h3>
        </div>
    );
} 


export function ContentEmptyPanel(props) {
    return (
        <Panel>
            <ContentEmptyIndicator>
                {props.children}
            </ContentEmptyIndicator>
        </Panel>
    );
}


export function ContentLoadingIndicator(props) {
    return (
        <div className="indicator">
            <FontAwesomeIcon icon_class="spinner" icon_size="5x" spin={true} />
        </div>
    );
} 
