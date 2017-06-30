import font_awesome_style from '~/../css/font-awesome.min.css';


import React from 'react';

const icon_sizes = [
    'lg',
    '2x',
    '3x',
    '4x',
    '5x'
];

export default function FontAwesomeIcon(props) {
    let classes = [
        'fa',
        `fa-${props.icon_class}`
    ];

    if (icon_sizes.includes(props.icon_size)) {
        const icon_size = ` fa-${props.icon_size}`;
        classes.push(icon_size);
    }

    if (props.fixed_width === true) {
        classes.push('fa-fw');
    }

    if (props.spin === true) {
        classes.push('fa-spin');
    }

    const class_name = classes.join(' ');

    return (
        <i className={class_name} aria-hidden="true"></i>
    );
}

