export const names = (state = [], action) => {
    switch(action.type) {
        case 'ADD':
            return [
                ...state,
                {value: action.value,
                id: action.id}
            ];
        case 'REMOVE':
            return state.filter((name)=>{return name.id != action.id});
        case 'LOAD_ALL':
            return action.value;
    }
    return state;
}