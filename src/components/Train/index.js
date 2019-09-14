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
import * as _ from 'lodash';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TrainSettings from '../TrainSettings';
import { modelsConfig, columnsHeader } from './config';

const mapStateToProps = state => {
    return ({ train: state.train, trainFile: state.dataFile.train});
}
 
class Train extends Step{

    constructor(props, context){
        super(props, context);
        this.handleClose = this.handleClose.bind(this);
        this.onClickSettings = this.onClickSettings.bind(this);
    }

    /**
     * Method on click of Start Training button
     */
    onClickNext() {
        const { actions, train } = this.props;
        actions.callAutoTrain();
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
        const {train: {models}} = this.props;

        return modelsConfig.every((row) => {
            return(models.indexOf(row.id) !== -1);
        });
    }

    handleClickForHeaderCheckbox(e) {

        const {actions} = this.props;

        actions.selectAllModels2Train(!this.checkAllRecordsSelected());
    }

    isSelected(row) {
        const {train: {models}} = this.props;

        return (models.indexOf(row.id) !== -1 ? true : false);
    }

    isAnySelected() {
        const {train: {models}} = this.props;

        return models.length>0;
    }

    handleClickForCheckbox(e, row){
        const {actions} = this.props;
        
        actions.selectModel2Train(row.id);
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
        const {train} = this.props;
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
                        <Collapse in={train.inProgress}>
                            <ProgressBar animated="true"
                                now={train.progress} 
                                label={`${train.progress}%`}
                                variant={train.apiError ? "danger" : "success"}
                                />
                        </Collapse>
                        <Button onClick={() => this.onClickNext()} disabled={!this.isAnySelected() || train.inProgress}>
                            Start Training
                        </Button>
                    </Card.Body>
                </Card>
            </>
        );
    }
};

Train.propTypes = {
    statePath: PropTypes.string.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Train);
