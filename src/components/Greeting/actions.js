let nextId = 0;

export const addName = (name) => (
    {
        type: 'ADD',
        value: name,
        id: ++nextId
    }
);

export const removeName = (index) => (
    {
        type: 'REMOVE',
        id: index
    }
);

export const loadAll = (list) => (
    {
        type: 'LOAD_ALL',
        value: list
    }
);

export function setNextId(newId) {
    nextId = newId;
}