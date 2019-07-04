import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const Entry = (args) => (
    <div>
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text id="a-name-label">Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                id = "a-name"
                placeholder="First Name"
                aria-label="First Name"
                aria-describedby="a-name-label"
            />
            <Button variant="primary" onClick={() => onClick(args.onAdd)}>Add</Button>
        </InputGroup>
    </div>
);

function onClick(onAdd) {
    let s = document.getElementById('a-name');
    onAdd(s.value);
}
export {Entry};