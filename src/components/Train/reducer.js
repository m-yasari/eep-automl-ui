import * as _ from 'lodash';
import * as type from '../../actions/types';
import * as Constants from '../../constants';
import { modelsConfig } from './config';

export const train = (state = {}, action) => {
    let models;
    switch(action.type) {
        case type.OPEN_SETTINGS_TRAIN:
            state = _.clone(state);
            _.set(state, "showPopup", action.showPopup);
            break;

        case type.DISABLE_TRAIN_TAB:
            state = _.clone(state);
            _.set(state, "disableTrainTab", action.disableTrainTab);
            break;
        case type.TRAIN_SELECT_ALL_MODELS:
            models = [];
            if (action.flag) {
                modelsConfig.map((item) => models.push(item.id));
            }
            state = Object.assign({}, state, {
                models: models
            });
            break;
        case type.TRAIN_SELECT_MODEL:
            models = [...state.models];
            modelsConfig.map((item) => {
                if (item.id === action.id) {
                    let idx = models.indexOf(item.id);
                    if (idx === -1) {
                        models.push(item.id)
                    } else {
                        models.splice(idx, 1);
                    }
                }
            });
            state = Object.assign({}, state, {
                models: models
            });
            break;
        case type.TRAIN_APPLY_SETTINGS:
            state = Object.assign({}, state, action.data);
            break;
        case type.TRAIN_START:
            state  = Object.assign({}, state, {
                inProgress: true,
                progress: 0,
                progressMsg: '',
                trained: false,
                trainData: null,
            });
            break;
        case type.TRAIN_IN_PROGRESS:
            state  = Object.assign({}, state, {
                progress: Math.round(action.job.progress * 100),
                progressMsg: action.job.progress_msg,
            });
            break;
        case type.TRAIN_COMPLETED:
            state  = Object.assign({}, state, {
                inProgress: false,
                trained: true,
                trainData: action.data,
            });
            break;
        case type.TRAIN_ERROR:
            state  = Object.assign({}, state, {
                inProgress: false,
                trained: false,
                apiError: action.error,
            });
            break;
    }
    return state;
}