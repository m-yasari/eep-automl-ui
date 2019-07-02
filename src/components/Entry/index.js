import React from 'react';

const Entry = (args) => (
    <div>
        <span><input type='text' id='aName' /></span>
        <span><input type='button' id='addName' onClick={() => onClick(args.onAdd)} value="Add" /></span>
    </div>
);

function onClick(onAdd) {
    let s = document.getElementById('aName');
    onAdd(s.value);
}
export {Entry};