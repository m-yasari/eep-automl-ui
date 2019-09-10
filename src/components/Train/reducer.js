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
    }
    return state;
}