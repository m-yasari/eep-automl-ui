import {combineReducers} from 'redux';
import {names} from '../components/Greeting/reducer';

const noopReducer = (state = {}, action) => state;

export default combineReducers({
    noopReducer,
    names
});