import * as type from './types';
import { checkFile, importFile } from '../api';

export const resetState = (statePath) => (
    { 
        type: type.RESET_STATE,
        statePath: statePath,
    }
);

export const changeState = (statePath, val, attr = null) => (
    { 
        type: type.CHANGE_STATE,
        attribute: attr,
        value: val,
        statePath: statePath,
    }
);

export const addName = name => ({ type: type.ADD_NAME, value: name });

export const removeName = index => ({ type: type.REMOVE_NAME, id: index });

export const loadAllNames = list => ({ type: type.LOAD_ALL_NAMES, value: list });

export const importFileStart = (category, filename) => ({ 
    type: type.IMPORT_FILE_START, 
    category: category,
    filename: filename,
});

export const importFileComplete = (category, data, error) => ({ 
    type: type.IMPORT_FILE_COMPLETED, 
    value: data,
    category: category,
    error: error,
});

export const fileImported = (category) => ({ 
    type: type.FILE_IMPORTED,
    category: category,
});

export const callImportFile = (category, filename) => (dispatch, getState) => {
    importFile(filename).then(
        resp => {
            let success = resp.status === 200;
            if ( success ) {
                return resp.json();
            } else {
                dispatch(importFileComplete(category, null, `Import error: ${resp.statusText}`));
            }
        }
    ).then(data => {
        dispatch(importFileComplete(category, _.get(data, 'destination_frames[0]'), 'data'));
        dispatch(fileImported(category));
    });
};
