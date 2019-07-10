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

export const changeMainTab = (activeKey) => ({ type: type.CHANGE_MAIN_TAB, activeKey: activeKey});

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

export const parseSetup = (category, filename) => ({ 
    type: type.PARSE_SETUP, 
    category: category,
    filename: filename,
});

export const parseStart = (category, filename) => ({ 
    type: type.PARSE_START, 
    category: category,
    filename: filename,
});

export const parseInProgress = (category, job) => ({ 
    type: type.PARSE_IN_PROGRESS, 
    category: category,
    job: job,
});

export const parseComplete = (category, data, error) => ({ 
    type: type.PARSE_COMPLETED, 
    value: data,
    category: category,
    error: error,
});

// Following actions are invoking H2O APIs

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
        dispatch(importFileComplete(category, _.get(data, 'destination_frames[0]')));
        dispatch(fileImported(category));
    });
};
