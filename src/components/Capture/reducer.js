import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';

export const capture = (state = [], action) => {
    let newState, fileImport;
    switch(action.type) {
        case type.IMPORT_FILE_START:
            newState = _.clone(state);
            fileImport  = _.clone(_.get(newState, action.category));
            fileImport.inProgress = true;
            fileImport.name = action.filename;
            _.set(newState, action.category, fileImport);
            state = newState;
            break;
        case type.IMPORT_FILE_COMPLETED:
            newState = _.clone(state);
            fileImport  = _.clone(_.get(newState, action.category));
            fileImport.inProgress = false;
            fileImport.data = action.data;
            fileImport.error = action.error;
            _.set(newState, action.category, fileImport);
            state = newState;
            break;
        case type.FILE_IMPORTED:
            if (action.category === 'train') {
                newState = _.clone(state);
                _.set(newState, 'parseValidated', true);
                state = newState;
            }
            break;
    }
    return state;
}