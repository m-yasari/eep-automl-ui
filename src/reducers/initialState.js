
import * as Constants from '../constants';

const initialState = {
    // initialState
    main: {
        activeKey: Constants.CAPTURE_KEY,
        disableTrainTab: true,
        disableSummaryTab: true,
        disableLeaderboardTab: true,
        disablePredictTab: true,
    },
    capture: {
        validated: false,
        parseValidated: false,
        inProgress: false,
        parseResult: 'success',
        errors: {}
    },
    summary: {
        columns: [],
        selectedColumns: [],
    },
    dataFile: {
        train: {
            validated: false,
            name: '',
            inProgress: false,
            progress: 0,
            progressMsg: null,
            imported: false,
            importedData: null,
            parsedSetup: false,
            parsedSetupData : null,
            parsed: false,
            parsedData: null,
            apiError: null,
            formErrors: null,
            reparseRequired: false,
        },
        test: {
            validated: false,
            name: '',
            inProgress: false,
            progress: 0,
            progressMsg: null,
            imported: false,
            importedData: null,
            parsedSetup: false,
            parsedSetupData : null,
            parsed: false,
            parsedData: null,
            apiError: null,
            formErrors: null,
            reparseRequired: false,
        },
    },
    train: {
        showPopup: false,
        models: [],
        maxTrainTime: 3600,
        projectName: 'default',

        inProgress: false,
        trained: false,
        progress: 0,
        progressMsg: null,
        apiError: null,
        trainData: null,
    },
    predict: {
        model: null,
        inProgress: false,
        predicted: false,
        progress: 0,
        progressMsg: null,
        apiError: null,
        predictData: null,
        predictFrame: '',
        resultData: null,
    }
};

export default initialState;
