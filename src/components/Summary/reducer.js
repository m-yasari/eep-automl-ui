import * as _ from 'lodash';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

const getColumnsSpec = (parsedData) => {
    const columns = _.get(parsedData, 'frames[0].columns', []);

    const cols = [];
    const listItems = columns.map((col) => {
        cols.push({
            label: col.label,
            type: Constants.colType2Type(col.type),
            missing_count: col.missing_count,
            flag: false,
            output: false
        });
    });

    return cols;
};

export const summary = (state = {}, action) => {
    let col, cols;
    switch(action.type) {
        case type.PARSE_COMPLETED:
            state = Object.assign({}, state, {
                columns: getColumnsSpec(action.data),
                reparseRequired: false
            })
            break;
        case type.CHANGE_COLUMN_TYPE:
            col = _.clone(state.columns[action.column]);
            col.type = action.columnType;

            cols = _.clone(state.columns);
            cols[action.column] = col;
            state = Object.assign({}, state, {
                columns: cols,
                reparseRequired: true
            });
            break;
        case type.CHANGE_COLUMN_FLAG:
            col = _.clone(state.columns[action.column]);
            col.flag = action.flag;

            cols = _.clone(state.columns);
            cols[action.column] = col;
            state = Object.assign({}, state, {
                columns: cols
            });
            break;
        case type.CHANGE_TARGET_COLUMN:
            state = Object.assign({}, state, {
                target: action.column
            });
            break;
    }
    return state;
}