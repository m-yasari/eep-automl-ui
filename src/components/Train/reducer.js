import * as _ from 'lodash';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const train = (state = {}, action) => {
    switch(action.type) {
        case type.OPEN_SETTINGS_TRAIN:
            state = _.clone(state);
            _.set(state, "showPopup", action.showPopup);
            break;

        case type.DISABLE_TRAIN_TAB:
            state = _.clone(state);
            _.set(state, "disableTrainTab", action.disableTrainTab);
            break;
    }
    return state;
}