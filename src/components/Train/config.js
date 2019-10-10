export const modelsConfig = [
    {
        id: 1,
        model: 'DRF',
        provider: 'H2O AutoML',
        type: "Supervised",
        info: 'Supports Classification and Regression Use Cases',
        url : 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/drf.html',
    },
    {
        id: 2,
        model: 'GLM',
        provider: 'H2O AutoML',
        type: "Supervised",
        info: 'Support Regression Use Cases',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/glm.html',
    },
    {
        id: 3,
        model: 'XGBoost',
        provider: 'H2O AutoML',
        type: "Supervised",
        info: 'Support multiple models for Classification and Regression Use Cases with enhanced accuracy',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/xgboost.html',
    },
    {
        id: 4,
        model: 'GBM',
        provider: 'H2O AutoML',
        type: "Supervised",
        info: 'Support Classification and Regression Use Cases',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/gbm.html',
    },
    {
        id: 5,
        model: 'DeepLearning',
        provider: 'H2O AutoML',
        type: "Supervised",
        info: 'Supports Classification, Clustering, and Regression Use Cases',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/deep-learning.html',
    },
    {
        id: 6,
        model: 'StackedEnsemble',
        provider: 'H2O AutoML',
        type: "Supervised",
        info: 'Support multiple models for Classification and Regression Uses Cases with enhanced performance',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/stacked-ensembles.html',
    }
];

export const columnsHeader = [
    {
        name: 'id',
        label: '#',
        type: 'rowIndex',
        sortable: false
    },
    {
        name: 'model',
        label: 'Model',
        type: 'string',
        sortable: false
    },
    {
        name: 'provider',
        label: 'Provider',
        type: 'string',
        sortable: false
    },
    {
        name: 'flag',
        label: 'Flag',
        type: 'checkBox',
        sortable: false
    },
    {
        name: 'info',
        label: 'Description',
        type: 'link',
        sortable: false
    },
];
