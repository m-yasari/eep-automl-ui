import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const predict = (state = [], action) => {
    switch(action.type) {
        case type.PREDICT_MODEL_SELECT:
            state = Object.assign({}, state, {
                model: action.model
            });
            break;
    }
    return state;
}