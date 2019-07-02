import React from 'react';

export const Hello = (name) => (
    <li>
        <div><span>Hello {name.value}</span> <a href='#' onClick={name.onClick}>-</a></div>
    </li>
);
