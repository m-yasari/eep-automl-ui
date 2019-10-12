import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';
import * as Constants from '../../constants';
import { columnsHeader } from './config';

const sortData = (data, column, ascend) => {
    const colName = columnsHeader[column].dataColName;
    return data.sort((a,b) => {
        let flag = colName === "modelId" ? 
            a[colName].localeCompare(b[colName]) : 
            (a[colName]-b[colName]);
        if (!ascend && flag!==0) {
            flag = -flag;
        }
        return flag;
    });
}

const constructLeaderboardObjects = (data) => {
    let objData = []
    data[0].map((row, rowIdx) => {
        objData.push({
            index: data[0][rowIdx],
            modelId: data[1][rowIdx],
            auc: data[2][rowIdx],
            logloss: data[3][rowIdx],
            meanPerClassErr: data[4][rowIdx],
            rmse: data[5][rowIdx],
            mse: data[6][rowIdx]
        });
    });
    return objData;
}

export const leaderboard = (state = [], action) => {
    switch(action.type) {
        case type.LEADERBOARD_DATA:
            state =Object.assign({}, state, {
                data: constructLeaderboardObjects(action.data),
            });
            break;
        case type.LEADERBOARD_SORT:
            state = Object.assign({}, state, {
                sortColumn: action.column,
                ascend: action.ascend,
                data: sortData(state.data, action.column, action.ascend),
            });
            break;
    }
    return state;
}