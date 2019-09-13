import * as type from './types';
import * as Constants from '../constants';
import {modelsConfig} from '../components/Train/config';
import { checkFile, importFile, parseSetup, parse, jobStatus, frameSummary, 
    automlBuilder, automlLeaderboard } from '../api';
import mapDispatchToProps from './creator';

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

export const setDisableSummaryFlag = (disableSummaryTab) => ({ type: type.DISABLE_SUMMARY_TAB, disableSummaryTab: disableSummaryTab});

export const setDisableTrainFlag = (disableTrainTab) => ({ type: type.DISABLE_TRAIN_TAB, disableTrainTab: disableTrainTab});

export const openSettingsTrain = (showPopup) => ({ type: type.OPEN_SETTINGS_TRAIN, showPopup: showPopup});

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

export const changeColumnType = (col, colType) => ({
    type: type.CHANGE_COLUMN_TYPE,
    column: col,
    columnType: colType
});

export const changeColumnFlag = (col, flag) => ({
    type: type.CHANGE_COLUMN_FLAG,
    column: col,
    flag: flag
});

export const changeTargetColumn = (col) => ({
    type: type.CHANGE_TARGET_COLUMN,
    column: col,
});

export const selectModel2Train = (id) => ({
    type: type.TRAIN_SELECT_MODEL,
    id: id,
});

export const selectAllModels2Train = (flag) => ({
    type: type.TRAIN_SELECT_ALL_MODELS,
    flag: flag
});

export const applyTrainSettings = (data) => ({
    type: type.TRAIN_APPLY_SETTINGS,
    data: data
});

export const trainStart = () => ({
    type: type.TRAIN_START
});

export const trainInProgress = (job) => ({
    type: type.TRAIN_IN_PROGRESS,
    job: job,
});

export const trainComplete = (data) => ({
    type: type.TRAIN_COMPLETED,
    data: data,
});

export const trainError = (error) => ({
    type: type.TRAIN_ERROR,
    error: error,
});

export const reparse = (category) => (dispatch, getState) => {
    dispatch(parseStart(category));
    const parsedSetupData = _.get(getState(), `dataFile.${category}.parsedSetupData`);
    const reparseParam = _.get(getState(), "summary.columns");
    dispatch(callParse(category, parsedSetupData, reparseParam));
};

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

export const callParse = (category, parseSetupResult, reparseParam) => (dispatch, getState) => {
    const body = parseParamBuilder(parseSetupResult, reparseParam);
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

const parseParamBuilder = (parseSetupResult, reparseParam = null) => {
    let columns = null;
    if (reparseParam) {
        columns = [];
        reparseParam.map((col) => {
            columns.push(col.type);
        });
    }
    return {
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
        column_types: columns || parseSetupResult.column_types,
    }
};

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

export const callAutoTrain = () => (dispatch, getState) => {
    let frame = _.get(getState(), `dataFile.train.parsedSetupData.destination_frame`);
    const {train, summary} = getState();
    const algos = [];
    modelsConfig.map((item) => {
        if (train.models.indexOf(item.id) !== -1) {
            algos.push(item.model);
        }
    });
    const ignoredColumns = [];
    summary.columns.map((col, idx) => {
        if (idx !== summary.target && summary.selectedColumns.indexOf(idx) === -1) {
            ignoredColumns.push(col.label);
        }
    });
    
    const trainData = {
        "input_spec": {
          "training_frame": frame,
          "response_column": summary.columns[summary.target].label,
          //"fold_column": "${fold_column}",
          //"weights_column": "${weights_column}",
          "ignored_columns": ignoredColumns,
          "sort_metric": "AUC"
        },
        "build_models":{
          "include_algos": algos
        },
        "build_control": {
          "nfolds": 5,
          /*"keep_cross_validation_predictions":"${keep_cross_validation_predictions}",
          "keep_cross_validation_models":"${keep_cross_validation_models}",
          "keep_cross_validation_fold_assignment":"${keep_cross_validation_fold_assignment}",
          "balance_classes":"${balance_classes}",
          "class_sampling_factors":"${class_sampling_factors}",
          "max_after_balance_size":"${max_after_balance_size}",
          "export_checkpoints_dir":"${export_checkpoints_dir}",*/
          "stopping_criteria":{
            "seed": new Date().getTime(),
            //"max_models":"${max_models}",
            "max_runtime_secs": train.maxTrainTime,
            //"stopping_rounds":"${stopping_rounds}",
            //"stopping_tolerance":"${stopping_tolerance}"
          },
          "project_name": train.projectName
        }
    };
    dispatch(trainStart());
    automlBuilder(trainData).then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(monitorTrainInProgress(json));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(trainError(`Train error: ${err.statusText}`));
        } else {
            dispatch(trainError(`Train error: ${err}`));
        }
    });
};

const monitorTrainInProgress = (parseResponse) => (dispatch, getState) => {
    const jobId = _.get(parseResponse, 'job.key.name');
    const id = setInterval(() => {
        callJobStatus(jobId).then(
            resp => {
                console.log(resp);
                let job = _.get(resp, 'jobs[0]');
                dispatch(trainInProgress(job));
                if (job.status === 'DONE') {
                    clearInterval(id);
                    dispatch(callTrainSummary());
                }
            },
            err => {
                clearInterval(id);
                console.log(`Job error: ${err}!`);
                dispatch(trainError(err));
            }
        )
    }, 1000);
};

const callTrainSummary = () => (dispatch, getState) => {
    let projectName = _.get(getState(), `train.projectName`);
    automlLeaderboard(projectName, 'event_log,event_log_table').then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { 
        dispatch(trainComplete(json));
        dispatch(changeMainTab(Constants.LEADERBOARD_KEY));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            dispatch(trainError(`TrainSummary error: ${err.statusText}`));
        } else {
            dispatch(trainError(err));
        }
    });
}

