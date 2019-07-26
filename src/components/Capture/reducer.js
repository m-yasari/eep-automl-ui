import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const capture = (state = [], action) => {
    let newState, fileImport;
    /*if (action.category === Constants.TRAIN_DATA) {
        switch(action.type) {
            case type.IMPORT_FILE_DONE:
                state = Object.assign({}, state, {parseValidated: true});
                break;
            case type.PARSE_SETUP_START:
                state  = Object.assign({}, state, {
                    inProgress: true,
                    parsedSetup: false,
                    parsed: false,
                    parsedSetupData: null,
                    parsedData: null,
                    apiError: null
                });
                break;
            case type.PARSE_SETUP_COMPLETED:
                state  = Object.assign({}, state, {
                    inProgress: false,
                    parseSetup: !action.error,
                    parsedSetupData: action.data,
                    apiError: action.error
                });
                break;
            case type.PARSE_START:
                state  = Object.assign({}, state, {
                    inProgress: true,
                    progress: 0,
                    progressMsg: '',
                    parsed: false,
                    parsedData: null,
                    apiError: null
                });
                break;
            case type.PARSE_IN_PROGRESS:
                state  = Object.assign({}, state, {
                    inProgress: true,
                    progress: action.job.progress,
                    progressMsg: action.job.progress_msg,
                    apiError: null
                });
                break;
            case type.PARSE_COMPLETED:
                state  = Object.assign({}, state, {
                    inProgress: false,
                    parsed: !action.error,
                    parsedData: action.data,
                    apiError: action.error
                });
                break;
            }
    }*/
    return state;
}