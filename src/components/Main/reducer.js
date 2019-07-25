import * as _ from 'lodash';
import * as type from '../../actions/types';

export const main = (state = [], action) => {
    switch(action.type) {
        case type.CHANGE_MAIN_TAB:
            state = _.clone(state);
            _.set(state, "activeKey", action.activeKey);
            break;
    }
    return state;
}