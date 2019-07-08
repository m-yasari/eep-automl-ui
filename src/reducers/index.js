import {combineReducers} from 'redux';
import * as _ from 'lodash';
import * as type from '../actions/types';
import initialState from './initialState';
import {names} from '../components/Greeting/reducer';
import {main} from '../components/Main/reducer';
import {capture} from '../components/Capture/reducer';
import mapDispatchToProps from '../actions/creator';

const resetStateReducer = (state = {}, action) => {
    state = _.clone(state);
    let resetObj = _.clone(_.get(initialState, action.statePath));
    
    _.set(state, action.statePath, resetObj);
    return state;
}

const changeStateReducer = (state = {}, action) => {
    state = _.clone(state);
    let statePathArr = Array.isArray(action.statePath) ? action.statePath :
        (action.statePath ? action.statePath.split('.') : [] );

    if (action.attribute) {
        let attributeArr = Array.isArray(action.attribute) ? action.attribute :
            action.attribute.split('.');
        statePathArr = statePathArr.concat(attributeArr)
    }
    
    _.set(state, statePathArr, action.value);

    return state;
}

const reducer = combineReducers({
    names,
    main,
    capture,
});

export default () => (state, action) => {

    switch(action.type) {
        case type.RESET_STATE: 
            return resetStateReducer(state, action);
        
        case type.CHANGE_STATE: 
            return changeStateReducer(state, action);
        
        default:
            return reducer(state, action);
    }
};