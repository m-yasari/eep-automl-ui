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

    /**
     * Method to go to the specific link on click of Documentation
     */
    onClickLink(e, name){
        window.open(`/model/${name}`, name);
    }

    /**
    * @param num The number to round
    * @param precision The number of decimal places to preserve
    */
    roundUp(num, precision) {
        precision = Math.pow(10, precision)
        return Math.ceil(num * precision) / precision
    }

    predictTestData(evt, modelName) {
        alert(`Predict with ${modelName}`);
    }

    downloadMojo(evt, modelName) {
        alert(`Download MOJO of ${modelName}`);
    }

    downloadPojo(evt, modelName) {
        alert(`Download POJO of ${modelName}`);
    }

    renderModelDropdown(modelName) {
        return (
        <DropdownButton title={modelName}>
            <Dropdown.Item onClick={(e) => this.predictTestData(e, modelName)}>Predict on a test data</Dropdown.Item>
            <Dropdown.Item onClick={(e) => this.downloadMojo(e, modelName)}>Download MOJO format</Dropdown.Item>
            <Dropdown.Item onClick={(e) => this.downloadPojo(e, modelName)}>Download POJO format</Dropdown.Item>
        </DropdownButton>
        );
    }

    render() {

        const { train, actions} = this.props
        const leaderboard = _.get(train, "trainData.leaderboard_table.data", [[]]);
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
                                        {columnsHeader.map((columnHead, index) => (
                                            <th key={index}>{columnHead.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    { leaderboard[0].map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            { columnsHeader.map((column, columnIndex) => {
                                                switch(column.type){

                                                    case 'link' :
                                                        return (
                                                            <td key={columnIndex}>
                                                                {this.renderModelDropdown(leaderboard[column.colNum][rowIndex])}
                                                            </td>
                                                        );

                                                    case 'number' :
                                                        return (<td key={columnIndex}>{this.roundUp(leaderboard[column.colNum][rowIndex], 4)}</td>);

                                                    default:
                                                        return (<td key={columnIndex}>{leaderboard[column.colNum][rowIndex]}</td>);
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
