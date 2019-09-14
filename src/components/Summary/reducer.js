import * as _ from 'lodash';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

const getColumnsSpec = (parsedData) => {
    const columns = _.get(parsedData, 'frames[0].columns', []);

    const cols = [];
    columns.map((col) => {
        cols.push({
            label: col.label,
            type: Constants.colType2Type(col.type),
            missing_count: col.missing_count,
            mean: col.mean,
            sigma: col.sigma,
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
            const selectedColumns = [...state.selectedColumns];
            let idx = selectedColumns.indexOf(action.column);

            if (action.flag && idx===-1 && action.column!==state.target) {
                selectedColumns.push(action.column);
            } else if (!action.flag && idx!==-1) {
                selectedColumns.splice(idx, 1);
            }
            state = Object.assign({}, state, {
                selectedColumns: selectedColumns
            });
            break;
        case type.CHANGE_TARGET_COLUMN:
            state = Object.assign({}, state, {
                target: action.column
            });
            break;

        case type.DISABLE_SUMMARY_TAB:
            state = _.clone(state);
            _.set(state, "disableSummaryTab", action.disableSummaryTab);
            break;
    }
    return state;
}