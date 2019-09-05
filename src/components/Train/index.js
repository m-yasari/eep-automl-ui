import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import DataFile from '../DataFile';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import Table from 'react-bootstrap/Table';
import FontAwesomne from 'react-fontawesome';
import TrainSettings from '../TrainSettings/TrainSettings_cmp';
import CustomButton from '../CustomButton/index';

const mapStateToProps = state => {
    return ({ train: state.train, trainFile: state.dataFile.train});
}
 
class Train extends Step{

    constructor(props, context){
        super(props, context);
        this.state = {
            selectedRowsIdArr: [],
            disableStartTraining: true,
    columnHeader : [
        {
            columnName: '#',
            columnType: 'rowIndex',
            sortable: false
        },
        {
            columnName: 'Models',
            columnType: 'string',
            sortable: false
        },
        {
            columnName: 'Provider',
            columnType: 'string',
            sortable: false
        },
        {
            columnName: 'Flag',
            columnType: 'checkBox',
            sortable: false
        },
        {
            columnName: 'Info',
            columnType: 'link',
            sortable: false
        },
        // '#',
        // 'Models',
        // 'Provider',
        // 'Flag',
        // 'Info'
    ],
    dummyData : [
        {
            '#': 1,
            'Models': 'DRF',
            'Provider': 'H2O AutoML',
            'Info': 'Documentation',
            'Link' : 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/drf.html',
            'id': 1
        },
        {
            '#': 2,
            'Models': 'GLM',
            'Provider': 'H2O AutoML',
            'Info': 'Documentation',
            'Link': 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/glm.html',
            'id': 2
        },
        {
            '#': 3,
            'Models': 'XGBoost',
            'Provider': 'H2O AutoML',
            'Info': 'Documentation',
            'Link': 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/xgboost.html',
            'id': 3
        },
        {
            '#': 4,
            'Models': 'GBM',
            'Provider': 'H2O AutoML',
            'Info': 'Documentation',
            'Link': 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/gbm.html',
            'id': 4
        },
        {
            '#': 5,
            'Models': 'DeepLearning',
            'Provider': 'H2O AutoML',
            'Info': 'Documentation',
            'Link': 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/deep-learning.html',
            'id': 5
        },
        {
            '#': 6,
            'Models': 'Stack Ensembled',
            'Provider': 'H2O AutoML',
            'Info': 'Documentation',
            'Link': 'http://docs.h2o.ai/h2o/latest-stable/h2o-docs/data-science/stacked-ensembles.html',
            'id': 6
        }
    ]
};
this.handleClose = this.handleClose.bind(this);
this.onClickInfo = this.onClickInfo.bind(this);
    }

    /**
     * Method on click of Start Training button
     */
    onClickNext() {
        const { actions, trainFile } = this.props;
        actions.changeMainTab(Constants.LEADERBOARD_KEY);
        actions.setDisableSummaryFlag(false);
        actions.setDisableTrainFlag(false);
    }

    /**
     * Method to go to the specific link on click of Documentation
     */
    onClickLink(e, row){
        window.location.href = row.Link;
    }

    onClickInfo(e) {
        const {actions} = this.props;
        actions.openSettingsTrain(true);
    }

    handleClose(e) {
        const {actions} = this.props;
        actions.openSettingsTrain(false);
    }

    checkAllRecordsSelected() {
        const {selectedRowsIdArr} = this.state;

        return this.state.dummyData.every((row) => {
            return(selectedRowsIdArr.indexOf(row.id) !== -1);
        });
    }

    handleClickForHeaderCheckbox(e) {

        const {selectedRowsIdArr} = this.state;

        let allRowsSelected = this.checkAllRecordsSelected();

        let concatArray = [...this.state.selectedRowsIdArr];

        if(!allRowsSelected){

            this.state.dummyData.forEach(function(row){

                if(selectedRowsIdArr.indexOf(row.id) === -1){
                      concatArray = [...concatArray];
                      concatArray.push(row.id);
                }
            })

            this.setState({ selectedRowsIdArr: concatArray});
            this.setState({disableStartTraining: false});
        }
        else {
            let tempArr = [];
            this.setState({ selectedRowsIdArr: tempArr});
            this.setState({disableStartTraining: true});
        }
    }

    isSelected(row) {
        const {selectedRowsIdArr} = this.state;

        return (selectedRowsIdArr.indexOf(row.id) !== -1 ? true : false);
    }

    handleClickForCheckbox(e, row){
        const {selectedRowsIdArr} = this.state;
        
        let concatArray = [...selectedRowsIdArr];

        if(!this.isSelected(row)){
            concatArray.push(row.id);

            this.setState({selectedRowsIdArr: concatArray});
            this.setState({disableStartTraining: false});
        }
        else {
            var index = concatArray.indexOf(row.id);
            if( index !== -1){
                concatArray.splice(index, 1);
                this.setState({selectedRowsIdArr: concatArray});
            }

            if(concatArray.length === 0){
                this.setState({disableStartTraining: true});
            }
        }
    }
    
    // componentDidMount(){
    //     this.forceUpdate();
    // }

    render() {
        const {train, actions} = this.props;

        const {columnHeader, dummyData, disableStartTraining} = this.state;

        return (
            <>
                <TrainSettings closePopup={this.handleClose} />
                <Card>
                    <Card.Body>
                        <CustomButton onClick={this.onClickInfo}>
                            <FontAwesomne name='cog' size='2x' style = {{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', float: 'right'}} />
                        </CustomButton>
                    <Card.Title>Models for Training</Card.Title>
                        <Form id="train-form">
                            <Table striped border hover>
                                <thead>
                                    <tr>
                                        {columnHeader.map((columnHead, index) => {
                                            if(columnHead.columnType === 'checkBox'){
                                                return(
                                                    <th key={index}>
                                                        Flag
                                                        <Form.Check type="checkbox" aria-label="Select field to to select all rows."
                                                        checked={this.checkAllRecordsSelected()}
                                                        onClick={(e) => this.handleClickForHeaderCheckbox(e)} />
                                                    </th>
                                                );
                                            }
                                            else {
                                                return (
                                                    <th key={index}>{columnHead.columnName}</th>
                                                );
                                            }
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dummyData.map((row, rowIndex) => {
                                            const selected = this.isSelected(row);
                                            return(
                                                <tr key = {rowIndex}>
                                                    {
                                                        columnHeader.map((column, columnIndex) => {
                                                            switch(column.columnType){
                                                                case 'rowIndex':
                                                                    return (<td key={columnIndex}>{++rowIndex}</td>);
                                                                    break;

                                                                case 'checkBox':
                                                                    return(<td key={columnIndex}>
                                                                        <Form.Check type="checkbox" aria-label="Select field to consider it as a factor."
                                                                        onClick={(e) => this.handleClickForCheckbox(e, row)}
                                                                        checked = {selected} />
                                                                    </td>);
                                                                    break;

                                                                case 'link' :
                                                                    return (
                                                                        <td key={columnIndex}>
                                                                            <button type="button" class="btn btn-link" onClick={(e) => this.onClickLink(e, row)}>Documentation</button>
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
                        <Button onClick={() => this.onClickNext()} disabled={disableStartTraining}>
                            Start Training
                        </Button>
                    </Card.Body>
                </Card>
            </>
        );
    }
}

Train.propTypes = {
    statePath: PropTypes.string.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Train);
