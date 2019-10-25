import 'whatwg-fetch';
import * as _ from 'lodash';
import * as endpoints from './endpoints-dev.json';
import { isArray } from 'util';

const mergeFormData = (template, data) => {
    let bodyArr = [];
    Object.keys(template).map(param => {
        let val = template[param];
        if (val === '$' || val.startsWith('$:')) {
            let dataval = _.get(data, param);
            if ((dataval===undefined || dataval===null) && val.startsWith('$:')) {
                dataval = val.substring(2);
            }
            if (isArray(dataval)) {
                dataval = JSON.stringify(dataval);
            }
            val = dataval;
        }
        bodyArr.push(`${param}=${encodeURIComponent(val)}`);
    });
    return bodyArr.join('&');
};

const apiCall = (endpoint, data, paramsObject, authorizarion) => {
    let url = endpoint.url;
    const re = /\{[A-Za-z0-9_]*\}/g;

    if (url.search(re) !== -1) {
        url = _.clone(url);
        let found = url.match(re);
        found.map((key) => {
            url = url.replace(key, paramsObject[key.substring(1, key.length - 1)]);
        });
    }
    if (endpoint.params && paramsObject) {
        let paramArr = [];
        Object.keys(endpoint.params).map(param => {
            let val = endpoint.params[param];
            if (val === '$') {
                val = _.get(paramsObject, param);
            }

            if (val) {
                paramArr.push(`${param}=${encodeURIComponent(val)}`);
            }
        });
        url = `${url}?${paramArr.join('&')}`
    }
    const headers = endpoint.headers || {};
    if (authorizarion) {
        headers.Authorizarion = authorizarion;
    }
    const options = {
        method: endpoint.method,
        headers: headers,
    };
    if (endpoint.method.toUpperCase() === 'POST') {
        const contentType = endpoint.headers['Content-Type'];
        options.body = (contentType && contentType.startsWith('application/json')) ?
            JSON.stringify(data) : ( endpoint.body ? 
            mergeFormData(_.clone(endpoint.body), data) : data);
    }
    return fetch(url, options);
};

export const getEnvironment = (authorizarion) => {
    const endpoint = endpoints['env'];
    return apiCall(endpoint, null, null, authorizarion);
};

export const checkFile = (path, limit = -1) => {
    const endpoint = endpoints['check-file'];
    return apiCall(endpoint, null, {src: path, limit: limit});
};

export const uploadFile = (formData) => {
    const endpoint = endpoints['upload-file'];
    return apiCall(endpoint, formData);
};

export const importFile = (path) => {
    const endpoint = endpoints['import-file'];
    return apiCall(endpoint, null, {path: path});
};

export const parseSetup = (filenames, exclude_fields = null) => {
    const endpoint = endpoints['parse-setup'];
    const params = exclude_fields ? {_exclude_fields: [...exclude_fields]} : null;
    return apiCall(endpoint, {
        source_frames: filenames
    }, params);
};

export const parse = (parseObject, exclude_fields = null) => {
    const endpoint = endpoints['parse'];
    const params = exclude_fields ? {_exclude_fields: [...exclude_fields]} : null;
    return apiCall(endpoint, parseObject, params);
};

export const jobStatus = (jobId) => {
    const endpoint = endpoints['job-status'];
    return apiCall(endpoint, null, {job: jobId});
};

export const frameSummary = (frameId, exclude_fields = null) => {
    const endpoint = endpoints['frame-summary'];
    const params = {frame: frameId};
    if (exclude_fields) {
        params._exclude_fields = exclude_fields;
    } 
    return apiCall(endpoint, null, params);
};

export const frameDetails = (frameId, exclude_fields = null) => {
    const endpoint = endpoints['frame-details'];
    const params = {frame: frameId};
    if (exclude_fields) {
        params._exclude_fields = exclude_fields;
    } 
    return apiCall(endpoint, null, params);
};

export const automlBuilder = (trainData, exclude_fields = null) => {
    const endpoint = endpoints['automl-builder'];
    const params = exclude_fields ? {_exclude_fields: [...exclude_fields]} : null;
    return apiCall(endpoint, trainData, params);
};

export const automlLeaderboard = (project_name) => {
    const endpoint = endpoints['automl-leaderboard'];
    const params = {project_name: project_name};
    return apiCall(endpoint, null, params);
};

export const predict = (modelId, frameId, predictFrame, exclude_fields = null) => {
    const endpoint = endpoints['predict'];
    const params = {
        frame: frameId,
        model: modelId,
    };
    const predictObject = {
        predictions_frame: predictFrame,
    };
    if (exclude_fields) {
        params._exclude_fields = exclude_fields;
    } 
    return apiCall(endpoint, predictObject, params);
};

export const modelMetrics = (modelId, exclude_fields = null) => {
    const endpoint = endpoints['model-metrics'];
    const params = {
        model: modelId,
    };
    if (exclude_fields) {
        params._exclude_fields = exclude_fields;
    } 
    return apiCall(endpoint, null, params);
};

export const removeAllFrames = () => {
    const endpoint = endpoints['remove-frames'];
    const params = {
    };
    return apiCall(endpoint, null, params);
};

export const removeAllModels = () => {
    const endpoint = endpoints['remove-models'];
    const params = {
    };
    return apiCall(endpoint, null, params);
};

export const removeAll = () => {
    const endpoint = endpoints['remove-all'];
    const params = {
    };
    return apiCall(endpoint, null, params);
};
