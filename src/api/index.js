import 'whatwg-fetch';
import * as _ from 'lodash';
import * as endpoints from './endpoints-dev.json';

const mergeFormData = (template, data) => {
    let bodyArr = [];
    Object.keys(template).map(param => {
        let val = template[param];
        if (val === '$' || val.startsWith('$:')) {
            let dataval = _.get(data, param);
            if (!dataval && val.startsWith('$:')) {
                dataval = val.substring(2);
            }
            val = dataval;
        }
        bodyArr.push(`${param}=${encodeURIComponent(val)}`);
    });
    return bodyArr.join('&');
};

const apiCall = (endpoint, data, paramsObject = {}) => {
    let url = endpoint.url;
    if (endpoint.params) {
        let paramArr = [];
        Object.keys(endpoint.params).map(param => {
            let val = endpoint.params[param];
            if (val === '$') {
                val = _.get(paramsObject, param);
            }
            paramArr.push(`${param}=${encodeURIComponent(val)}`);
        });
        url = `${url}?${paramArr.join('&')}`
    }
    const options = {
        method: endpoint.method,
        headers: endpoint.headers || {},
    };
    if (endpoint.method.toUpperCase() === 'POST') {
        const contentType = endpoint.headers['Content-Type'];
        options.body = (contentType && contentType.startsWith('application/json')) ?
            data :
            mergeFormData(_.clone(endpoint.body), data);
    }
    return fetch(url, options);
};

export const checkFile = (path, limit = -1) => {
    const endpoint = endpoints['check-file'];
    return apiCall(endpoint, null, {src: path, limit: limit});
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
    return apiCall(endpoint, parseObject, params);
};

export const jobStatus = (job) => {
    const endpoint = endpoints['job-status'];
    return apiCall(endpoint, job);
};
