
import * as Constants from '../constants';

export default {
    // initialState
    main: {
        activeKey: Constants.CAPTURE_KEY,
    },
    capture: {
        validated: false,
        parseValidated: false,
        trainFile: {
            name: '',
            inProgress: false,
            validated: false,
            errors: {},
        },
        testFile: {
            name: '',
            inProgress: false,
            validated: false,
            errors: {},
        },
        inProgress: false,
        parseResult: 'success',
        errors: {}
    },
};

