
export const columnsHeader = [
    {
        name: 'Models',
        type: 'link',
        dataColName: 'modelId',
        sortable: false
    },
    {
        name: 'AUC',
        type: 'number',
        dataColName: 'auc',
        precision: 4,
        sortable: false
    },
    {
        name: 'Logloss',
        type: 'number',
        dataColName: 'logloss',
        precision: 4,
        sortable: false
    },
    {
        name: 'Mean per class err',
        type: 'number',
        dataColName: 'meanPerClassErr',
        multiplier: 100,
        precision: 2,
        sortable: false
    }
];
