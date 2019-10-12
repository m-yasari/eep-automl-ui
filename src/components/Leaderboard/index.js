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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = state => {
    return ({ leaderboard: state.leaderboard});
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
    
    renderSortAscend(column) {
        const { leaderboard: {sortColumn, ascend}, actions} = this.props
        const flag = ascend && column===sortColumn;
        return (
            <Button onClick={() => actions.leaderboardSort(column, true)} 
                disabled={flag} size="sm" variant={flag ? "warning" : "light"}>
                <FontAwesomeIcon icon='angle-up' size='1x'/>
            </Button>
        );
    }

    renderSortDescend(column) {
        const { leaderboard: {sortColumn, ascend}, actions} = this.props
        const flag = !ascend && column===sortColumn;
        return (
            <Button onClick={() => actions.leaderboardSort(column, false)} 
                disabled={flag} size="sm" variant={flag ? "warning" : "light"}>
                <FontAwesomeIcon icon='angle-down' size='1x'/>
            </Button>
        );
    }

    render() {

        const { leaderboard, actions} = this.props
        const lbData = leaderboard.data;

        return (
            <>
                <div>
                    Below is the result of AutoML training.<br />
                    <b>Process:</b><br />
                    <ol>
                        <li>List best performin models.</li>
                        <li>Ability to test model on a different data.</li>
                        <li>Ability download MOJO/POJO for productionizing.</li>
                    </ol>
                    <b>Note:</b> <i>Download POJO format</i> is not available for StackedEnsemble models.
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
                                            <th key={index}>
                                                {columnHead.name}
                                                {this.renderSortAscend(index)}
                                                {this.renderSortDescend(index)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    { lbData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            { columnsHeader.map((column, columnIndex) => {
                                                let value = row[column.dataColName];
                                                let key = `lb-${rowIndex}-${columnIndex}`;
                                                if (column.type === 'number') {
                                                    value = roundUp(value * (column.multiplier || 1), 
                                                        column.precision || 4);
                                                }
                                                switch(column.type){

                                                    case 'link' :
                                                        return (
                                                            <td key={key}>
                                                                {this.renderModelDropdown(value)}
                                                            </td>
                                                        );

                                                    default:
                                                        return (<td key={key}>{value}</td>);
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
