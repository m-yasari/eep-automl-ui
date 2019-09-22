import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const predict = (state = [], action) => {
    switch(action.type) {
        case type.PREDICT_MODEL_SELECT:
            state = Object.assign({}, state, {
                model: action.model,
                inProgress: false,
                progress: 0,
                progressMsg: '',
                predicted: false,
                predictData: null,
                resultData: null,
            });
            break;
        case type.PREDICT_START:
            state  = Object.assign({}, state, {
                inProgress: true,
                progress: 0,
                progressMsg: '',
                predicted: false,
                predictData: null,
                resultData: null,
            });
            break;
        case type.PREDICT_COMPLETED:
            state  = Object.assign({}, state, {
                inProgress: false,
                predicted: true,
                predictData: action.data,
            });
            break;
        case type.PREDICT_RESULT:
            state  = Object.assign({}, state, {
                inProgress: false,
                predicted: true,
                resultData: action.data,
            });
            break;
        case type.PREDICT_FRAME_NAME:
            state  = Object.assign({}, state, {
                predictFrame: action.frame,
            });
            break;
        case type.PREDICT_ERROR:
            state  = Object.assign({}, state, {
                inProgress: false,
                predicted: false,
                predictData: null,
                apiError: action.error,
            });
            break;
    }
    return state;
}