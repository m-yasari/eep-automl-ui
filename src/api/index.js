import 'whatwg-fetch';
import * as endpoints from './endpoints-dev.json';

export const getNames = () => {
    const endpoint = endpoints['fetch-names'];
    return fetch(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.headers || {},
    });
};
