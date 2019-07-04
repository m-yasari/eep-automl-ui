import React from 'react';

import ListGroupItem from 'react-bootstrap/ListGroupItem';

export const Hello = (name) => (
    <ListGroupItem action variant="secondary" onClick={name.onClick}>
        {name.value}
    </ListGroupItem>
);
