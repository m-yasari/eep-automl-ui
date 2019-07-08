import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';

export const capture = (state = [], action) => {
    let newState, fileImport, categoryPath;
    switch(action.type) {
        case type.IMPORT_FILE_START:
            newState = _.clone(state);
            categoryPath = action.category === 'test' ? 'testFile' : 'trainFile';
            fileImport  = _.clone(_.get(newState, categoryPath));
            fileImport.inProgress = true;
            fileImport.name = action.filename;
            _.set(newState, categoryPath, fileImport);
            state = newState;
            break;
        case type.IMPORT_FILE_COMPLETED:
            newState = _.clone(state);
            categoryPath = action.category === 'test' ? 'testFile' : 'trainFile';
            fileImport  = _.clone(_.get(newState, categoryPath));
            fileImport.inProgress = false;
            fileImport.data = action.data;
            fileImport.error = action.error;
            _.set(newState, categoryPath, fileImport);
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