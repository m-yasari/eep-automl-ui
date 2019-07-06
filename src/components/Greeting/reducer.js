import * as type from '../../actions/types';

export const names = (state = [], action) => {
    switch(action.type) {
        case type.ADD_NAME:
            let lastId = state.length >= 1 ? state[state.length-1].id : 0;
            return [
                ...state,
                {value: action.value,
                id: ++lastId}
            ];
        case type.REMOVE_NAME:
            return state.filter((name)=>{return name.id != action.id});
        case type.LOAD_ALL_NAMES:
            return action.value;
    }
    return state;
}