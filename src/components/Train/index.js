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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TrainSettings from '../TrainSettings';
import { modelsConfig, columnsHeader } from './config';

const mapStateToProps = state => {
    return ({ train: state.train, trainFile: state.dataFile.train});
}
 
class Train extends Step{

    constructor(props, context){
        super(props, context);
        this.state = {
            selectedRowsIdArr: [],
            disableStartTraining: true,
        };
        this.handleClose = this.handleClose.bind(this);
        this.onClickSettings = this.onClickSettings.bind(this);
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
        window.open(row.url, row.model);
    }

    onClickSettings(e) {
        const {actions} = this.props;
        actions.openSettingsTrain(true);
    }

    handleClose(e) {
        const {actions} = this.props;
        actions.openSettingsTrain(false);
    }

    checkAllRecordsSelected() {
        const {selectedRowsIdArr} = this.state;

        return modelsConfig.every((row) => {
            return(selectedRowsIdArr.indexOf(row.id) !== -1);
        });
    }

    handleClickForHeaderCheckbox(e) {

        const {selectedRowsIdArr} = this.state;

        let allRowsSelected = this.checkAllRecordsSelected();

        let concatArray = [...this.state.selectedRowsIdArr];

        if(!allRowsSelected){

            modelsConfig.forEach(function(row){

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
    
    renderTrainHeader(columnsHeader) {
        return (
            <thead>
                <tr>
                    {columnsHeader.map((columnHead, index) => {
                        if(columnHead.type === 'checkBox'){
                            return(
                                <th key={index}>
                                    <Form.Check type="checkbox" aria-label="Select field to to select all rows.">
                                        <Form.Check.Input type="checkbox" 
                                            checked={this.checkAllRecordsSelected()}
                                            onClick={(e) => this.handleClickForHeaderCheckbox(e)} />
                                        <Form.Check.Label>Flag</Form.Check.Label>
                                    </Form.Check>
                                </th>
                            );
                        }
                        else {
                            return (
                                <th key={index}>{columnHead.label}</th>
                            );
                        }
                    })}
                </tr>
            </thead>
        );
    }

    renderTrainData(columnsHeader, models) {
        const listItems = models.map((row, rowIndex) => {
            const selected = this.isSelected(row);
            return (
                <tr key = {rowIndex}>
                {
                    columnsHeader.map((column, columnIndex) => {
                        switch(column.type){
                            case 'rowIndex':
                                return (<td key={columnIndex}>{++rowIndex}</td>);

                            case 'checkBox':
                                return(<td key={columnIndex}>
                                    <Form.Check type="checkbox" aria-label="Select field to consider it as a factor."
                                    onClick={(e) => this.handleClickForCheckbox(e, row)}
                                    checked = {selected} />
                                </td>);

                            case 'link' :
                                return (
                                    <td key={columnIndex}>
                                        <Button class="btn btn-link" onClick={(e) => this.onClickLink(e, row)}>Documentation</Button>
                                    </td>
                                );

                            default:
                                return (<td key={columnIndex}>{row[column.name]}</td>);
                        }
                    })
                }
                </tr>
        );
    });
    return (
        <tbody>{listItems}</tbody>
    );
}

    render() {
        const {train, actions} = this.props;

        const { disableStartTraining } = this.state;

        const handleClose = this.handleClose;

        return (
            <>
                <TrainSettings closePopup={handleClose} />
                <Card>
                    <Card.Title>Models for Training</Card.Title>
                    <Card.Body>
                        <Button onClick={() => this.onClickSettings()} style={{ float: 'right'}} >
                            <FontAwesomeIcon icon='cog' size='2x' />
                        </Button>
                        <Form id="train-form">
                            <Table striped border hover>
                                {this.renderTrainHeader(columnsHeader)}
                                {this.renderTrainData(columnsHeader, modelsConfig)}
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
