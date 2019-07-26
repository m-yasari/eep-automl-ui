
import * as Constants from '../constants';

const initialState = {
    // initialState
    main: {
        activeKey: Constants.CAPTURE_KEY,
    },
    capture: {
        validated: false,
        parseValidated: false,
        inProgress: false,
        parseResult: 'success',
        errors: {}
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
        },
    }
};

export default initialState;
