
import * as Constants from '../constants';

const initialState = {
    // initialState
    features: {
        environment: 'production',
        uploadFeature: false,
        resetFeature: false,
    },
    main: {
        activeKey: Constants.CAPTURE_KEY,
        disableTrainTab: true,
        disableSummaryTab: true,
        disableLeaderboardTab: true,
        disablePredictTab: true,
        resetError: null,
        resetInProgress: false,
        resetPopup: false,
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
        target: null,
        recordsCount: 0,
    },
    dataFile: {
        train: {
            validated: false,
            name: '',
            uploadFilename: '',
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
            uploadFilename: '',
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
    leaderboard: {
        data: [],
        sortColumn: 1,
        ascend: false
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
