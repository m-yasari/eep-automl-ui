export const modelsConfig = [
    {
        id: 1,
        model: 'DRF',
        provider: 'H2O AutoML',
        info: 'Documentation',
        url : 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/drf.html',
    },
    {
        id: 2,
        model: 'GLM',
        provider: 'H2O AutoML',
        info: 'Documentation',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/glm.html',
    },
    {
        id: 3,
        model: 'XGBoost',
        provider: 'H2O AutoML',
        info: 'Documentation',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/xgboost.html',
    },
    {
        id: 4,
        model: 'GBM',
        provider: 'H2O AutoML',
        info: 'Documentation',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/gbm.html',
    },
    {
        id: 5,
        model: 'DeepLearning',
        provider: 'H2O AutoML',
        info: 'Documentation',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/deep-learning.html',
    },
    {
        id: 6,
        model: 'StackedEnsemble',
        provider: 'H2O AutoML',
        info: 'Documentation',
        url: 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/stacked-ensembles.html',
    }
];

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
        sortable: false
    },
    {
        name: 'Accuracy',
        type: 'number',
        colNum: 4,
        sortable: false
    },
    {
        name: 'F1-score',
        type: 'number',
        colNum: 5,
        sortable: false
    }
];
