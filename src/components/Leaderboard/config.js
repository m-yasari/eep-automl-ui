
export const columnsHeader = [
    {
        name: 'Models',
        type: 'link',
        colNum: 1,
        sortable: false
    },
    {
        name: 'AUC',
        type: 'number',
        colNum: 2,
        precision: 4,
        sortable: false
    },
    {
        name: 'Logloss',
        type: 'number',
        colNum: 3,
        precision: 4,
        sortable: false
    },
    {
        name: 'Mean per class err',
        type: 'number',
        colNum: 4,
        multiplier: 100,
        precision: 2,
        sortable: false
    }
];
