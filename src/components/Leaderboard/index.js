import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { roundUp } from '../../constants/utils';
import Table from 'react-bootstrap/Table';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import TrainSettings from '../TrainSettings';
import { columnsHeader } from './config';

const mapStateToProps = state => {
    return ({ train: state.train});
}
 
class Leaderboard extends Step{

    constructor(props, context){
        super(props, context);
    }

    predictTestData(evt, modelName) {
        const { actions } = this.props
        actions.selectModelForPredict(modelName);
        actions.callModelMetrics(modelName);
        actions.setDisablePredictFlag(false);
        actions.changeMainTab(Constants.PREDICT_KEY);
    }

    renderModelDropdown(modelName) {
        return (
        <DropdownButton title={modelName}>
            <Dropdown.Item onClick={(e) => this.predictTestData(e, modelName)}>Predict on a test data</Dropdown.Item>
            <Dropdown.Item href={`/api/3/Models/${modelName}/mojo`}>Download MOJO format</Dropdown.Item>
            <Dropdown.Item href={`/api/3/Models.java/${modelName}`} 
                disabled={modelName.search("StackedEnsemble")===-1 ? false : true}>Download POJO format</Dropdown.Item>
        </DropdownButton>
        );
    }

    render() {

        const { train, actions} = this.props
        const leaderboard = _.get(train, "trainData.leaderboard_table.data", [[]]);

        return (
            <>
                <div>
                    Below is the result of AutoML training, with a set of models ranked by AUC.<br />
                    Click on their name, and the following functions are available for each model:<br />
                    <ul>
                        <li><i>Predict on a test data</i>: Use this model and goes to next tab i.e. Predict. In Predict Tab, a test file can be imported and get predicted using the selected model.</li>
                        <li><i>Download MOJO format</i>: The generated model can be downloaded and integrated into an application to use it for live prediction.</li>
                        <li><i>Download POJO format</i>: The generated model can be downloaded and integrated into a Java application to use it for live prediction.</li>
                    </ul>
                    <b>Note: </b> <i>Download POJO format</i> is not available for StackedEnsemble models.
                    <hr />
                </div>
                <TrainSettings closePopup={() => this.handleClose()} parentActions={actions} />
                <Card>
                    <Card.Title>Leaderboard</Card.Title>
                    <Card.Body>
                        <Form id="leaderboard-form">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        {columnsHeader.map((columnHead, index) => (
                                            <th key={index}>{columnHead.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    { leaderboard[0].map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            { columnsHeader.map((column, columnIndex) => {
                                                let value = leaderboard[column.colNum][rowIndex];
                                                if (column.type === 'number') {
                                                    value = roundUp(value * (column.multiplier || 1), 
                                                        column.precision || 4);
                                                }
                                                switch(column.type){

                                                    case 'link' :
                                                        return (
                                                            <td key={columnIndex}>
                                                                {this.renderModelDropdown(value)}
                                                            </td>
                                                        );

                                                    default:
                                                        return (<td key={columnIndex}>{value}</td>);
                                                }
                                            }) }
                                        </tr>
                                    )) }
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
