import * as _ from 'lodash';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const main = (state = {}, action) => {
    switch(action.type) {
        case type.CHANGE_MAIN_TAB:
            state = _.clone(state);
            _.set(state, "activeKey", action.activeKey);
            break;
        case type.DISABLE_TRAIN_TAB:
            state = _.clone(state);
            _.set(state, "disableTrainTab", action.flag);
            break;
        case type.DISABLE_SUMMARY_TAB:
            state = _.clone(state);
            _.set(state, "disableSummaryTab", action.flag);
            break;
        case type.DISABLE_LEADERBOARD_TAB:
            state = _.clone(state);
            _.set(state, "disableLeaderboardTab", action.flag);
            break;
        case type.DISABLE_PREDICT_TAB:
            state = _.clone(state);
            _.set(state, "disablePredictTab", action.flag);
            break;
    }
    return state;
}