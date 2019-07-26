import * as type from './types';
import { checkFile, importFile, parseSetup, parse, jobStatus, frameSummary } from '../api';

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

export const importFilename = (category, filename) => ({
    type: type.IMPORT_FILENAME,
    category: category,
    filename: filename,
});

export const importDataFileStart = (category, filename) => ({
    type: type.IMPORT_DATA_FILE_START,
    category: category,
    filename: filename,
});

export const importDataFileComplete = (category, data) => ({
    type: type.IMPORT_DATA_FILE_COMPLETED,
    data: data,
    category: category,
});

export const importDataFileDone = (category, error) => ({
    type: type.IMPORT_FILE_DONE,
    category: category,
    error: error
});

export const parseSetupStart = (category) => ({
    type: type.PARSE_SETUP_START,
    category: category,
});

export const parseSetupComplete = (category, data) => ({
    type: type.PARSE_SETUP_COMPLETED,
    data: data,
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

export const parseComplete = (category, data) => ({
    type: type.PARSE_COMPLETED,
    data: data,
    category: category,
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
        dispatch(callParseSetup(category));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(importDataFileDone(category, `Import error: ${err.statusText}`));
        } else {
            dispatch(importDataFileDone(category, `Import error: ${err}`));
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
            dispatch(importDataFileDone(category, `ParseSetup error: ${err.statusText}`));
        } else {
            dispatch(importDataFileDone(category, `ParseSetup error: ${err}`));
        }
    });
};

export const callParse = (category, parseSetupResult) => (dispatch, getState) => {
    const body = parseParamBuilder(parseSetupResult);
    parse(body).then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(monitorParseInProgress(category, json));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(importDataFileDone(category, `Parse error: ${err.statusText}`));
        } else {
            dispatch(importDataFileDone(category, `Parse error: ${err}`));
        }
    });
};

const parseParamBuilder = (parseSetupResult) => ({
    destination_frame: parseSetupResult.destination_frame,
    source_frames: parseSetupResult.source_frames[0].name, // TODO: to make it through array functions
    parse_type: parseSetupResult.parse_type,
    separator: parseSetupResult.separator,
    number_columns: parseSetupResult.number_columns,
    single_quotes: parseSetupResult.single_quotes,
    column_names: parseSetupResult.column_names,
    check_header: parseSetupResult.check_header,
    delete_on_done: false,
    chunk_size: parseSetupResult.chunk_size,
    column_types: parseSetupResult.column_types,
});

const monitorParseInProgress = (category, parseResponse) => (dispatch, getState) => {
    const jobId = _.get(parseResponse, 'job.key.name');
    const id = setInterval(() => {
        callJobStatus(jobId).then(
            resp => {
                console.log(resp);
                let job = _.get(resp, 'jobs[0]');
                dispatch(parseInProgress(category, job));
                if (job.status === 'DONE') {
                    clearInterval(id);
                    dispatch(callFrameSummary(category));
                }
            },
            err => {
                clearInterval(id);
                console.log(`Job error: ${err}!`);
                dispatch(importDataFileDone(category, err));
            }
        )
    }, 1000);
};

const callJobStatus = (job) => {
    return new Promise((resolve,reject) => {
        jobStatus(job).then(resp => {
            if (!resp.ok) {
                throw new StatusException(resp.status, resp.statusText);
            }
            return resp.json();
        }).then((json) => { 
            resolve(json);
        }).catch(err => { // either fetching or parsing failed
            if (err.status >= 400) {
                reject(`JobStatus error: ${err.statusText}`);
            } else {
                reject(err);
            }
        }
    )});
}

const callFrameSummary = (category) => (dispatch, getState) => {
    let frame = _.get(getState(), `dataFile.${category}.parsedSetupData.destination_frame`);
    frameSummary(frame, 'frames/chunk_summary,frames/columns/data').then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { 
        dispatch(parseComplete(category, json));
        dispatch(importDataFileDone(category));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(importDataFileDone(category, `FrameSummary error: ${err.statusText}`));
        } else {
            dispatch(importDataFileDone(category, err));
        }
    });
}
