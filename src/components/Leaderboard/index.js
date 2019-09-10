import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import Table from 'react-bootstrap/Table';
import FontAwesomne from '@fortawesome/react-fontawesome';
import TrainSettings from '../TrainSettings';
import CustomButton from '../CustomButton/index';

const mapStateToProps = state => {
    return ({ leaderboard: state.leaderboard, train: state.train, trainFile: state.dataFile.train});
}
 
class Leaderboard extends Step{

    constructor(props, context){
        super(props, context);
        this.state = {
    columnHeader : [

        {
            columnName: 'Models',
            columnType: 'link',
            sortable: false
        },
        {
            columnName: 'AUC',
            columnType: 'number',
            sortable: false
        },
        {
            columnName: 'Accuracy',
            columnType: 'number',
            sortable: false
        },
        {
            columnName: 'F1-score',
            columnType: 'number',
            sortable: false
        }
    ],
    dummyData : [
        {
            'Models': 'DRF_ABCD_XYZ_123456',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
        {
            'Models': 'GLM_ABCD_XYZ_123456',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
        {
            'Models': 'XGBoost_ABCD_XYZ_123456',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
        {
            'Models': 'GBM_ABCD_XYZ_123456',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
        {
            'Models': 'DL_ABCD_XYZ_123456',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
        {
            'Models': 'SE_ABCD_XYZ_123456',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
        {
            'Models': 'GLM_AKTK_XYZ_190',
            'AUC': 0.9212,
            'Accuracy': 0.8909,
            'F1-score' : 0.9590,
        },
    ]
}
    }

    /**
     * Method to go to the specific link on click of Documentation
     */
    onClickLink(e, row){
        window.location.href = row.Link;
    }

    render() {

        const {train, actions} = this.props
        const {columnHeader, dummyData} = this.state;
        /*<CustomButton onClick={() => this.onClickInfo()}>
            <FontAwesomne name='cog' size='2x' style = {{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', float: 'right'}} />
        </CustomButton>*/

        return (
            <>
                <TrainSettings closePopup={() => this.handleClose()} parentActions={actions} />
                <Card>
                    <Card.Title>Models for Training</Card.Title>
                    <Card.Body>
                        <Form id="leaderboard-form">
                            <Table striped border hover>
                                <thead>
                                    <tr>
                                        {columnHeader.map((columnHead, index) => {
                                                return (
                                                    <th key={index}>{columnHead.columnName}</th>
                                                );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dummyData.map((row, rowIndex) => {

                                            return(
                                                <tr key = {rowIndex}>
                                                    {
                                                        columnHeader.map((column, columnIndex) => {
                                                            switch(column.columnType){

                                                                case 'link' :
                                                                    return (
                                                                        <td key={columnIndex}>
                                                                            <Button class="btn btn-link" onClick={(e) => this.onClickLink(e, row)}>{row[column.columnName]}</Button>
                                                                        </td>
                                                                    );
                                                                    break;

                                                                default:
                                                                    return (<td key={columnIndex}>{row[column.columnName]}</td>);
                                                                    break;
                                                            }
                                                        })
                                                    }
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Form>
                    </Card.Body>
                </Card>
            </>
        );
    }
}

Leaderboard.propTypes = {
    statePath: PropTypes.string.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Leaderboard);
