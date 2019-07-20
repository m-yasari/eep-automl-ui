import * as type from './types';
import { checkFile, importFile, parseSetup, parse } from '../api';

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

export const changeMainTab = (activeKey) => ({ type: type.CHANGE_MAIN_TAB, activeKey: activeKey });

export const importDataFileStart = (category, filename) => ({
    type: type.IMPORT_DATA_FILE_START,
    category: category,
    filename: filename,
});

export const importDataFileComplete = (category, data, error) => ({
    type: type.IMPORT_DATA_FILE_COMPLETED,
    data: data,
    category: category,
    error: error,
});

export const importFileDone = (category) => ({
    type: type.IMPORT_FILE_DONE,
    category: category,
});

export const parseSetupStart = (category) => ({
    type: type.PARSE_SETUP_START,
    category: category,
});

export const parseSetupComplete = (category, data, error) => ({
    type: type.PARSE_SETUP_COMPLETED,
    data: data,
    category: category,
    error: error,
});

export const parseSetupDone = (category) => ({
    type: type.PARSE_SETUP_DONE,
    category: category,
});

export const parseStart = (category) => ({
    type: type.PARSE_START,
    category: category,
});

export const parseInProgress = (category, job) => ({
    type: type.PARSE_IN_PROGRESS,
    category: category,
    job: job,
});

export const parseComplete = (category, data, error) => ({
    type: type.PARSE_COMPLETED,
    data: data,
    category: category,
    error: error,
});

// Following actions are invoking H2O APIs

const StatusException = (status, statusText) => ({
    status: status,
    statusText: statusText,
});

export const callImportFile = (category) => (dispatch, getState) => {
    const filename = _.get(getState(), `dataFile.${category}.name`);
    importFile(filename).then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(importDataFileComplete(category, _.get(json, 'destination_frames[0]')));
        dispatch(importFileDone(category));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(importDataFileComplete(category, null, `Import error: ${err.statusText}`));
        } else {
            dispatch(importDataFileComplete(category, null, `Import error: ${err}`));
        }
    });
};

export const callParseSetup = (category) => (dispatch, getState) => {
    const filename = _.get(getState(), `dataFile.${category}.name`);
    parseSetup(filename, ['data']).then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(parseSetupComplete(category, json));
        dispatch(parseStart(category));
        dispatch(callParse(category, json));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(parseSetupComplete(category, null, `Import error: ${err.statusText}`));
        } else {
            dispatch(parseSetupComplete(category, null, `Import error: ${err}`));
        }
    });
};

export const callParse = (category, parseSetupResult) => (dispatch, getState) => {
    parse(filename, ['data']).then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(parseComplete(category, json));
        dispatch(parseDone(category));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(parseComplete(category, null, `Import error: ${err.statusText}`));
        } else {
            dispatch(parseComplete(category, null, `Import error: ${err}`));
        }
    });
};
