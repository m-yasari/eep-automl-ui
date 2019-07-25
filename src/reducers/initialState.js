
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
            name: null,
            inProgress: false,
            imported: false,
            apiError: null,
            formErrors: {},
        },
        test: {
            name: null,
            inProgress: false,
            imported: false,
            apiError: null,
            formErrors: {},
        },
    }
};

export default initialState;
