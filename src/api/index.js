import 'whatwg-fetch';
import * as _ from 'lodash';
import * as endpoints from './endpoints-dev.json';

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
        options.body = JSON.stringify(data);
    }
    return fetch(url, options);
}

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
    const params = exclude_fields ? {exclude_fields: [...exclude_fields]} : null;
    return apiCall(endpoint, filenames, params);
};

export const parse = (parseObject, exclude_fields = null) => {
    const endpoint = endpoints['parse'];
    return apiCall(endpoint, parseObject, params);
};

export const jobStatus = (job) => {
    const endpoint = endpoints['job-status'];
    return apiCall(endpoint, job);
};
