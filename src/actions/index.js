import * as type from './types';

export const addName = name => ({ type: type.ADD_NAME, value: name });

export const removeName = index => ({ type: type.REMOVE_NAME, id: index });

export const loadAllNames = list => ({ type: type.LOAD_ALL_NAMES, value: list });
