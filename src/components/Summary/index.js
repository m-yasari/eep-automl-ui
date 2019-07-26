import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table'
import DataFile from '../DataFile';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { type } from 'os';

const mapStateToProps = state => {
    return ({ summary: state.summary, trainFile: state.dataFile.train });
}

class Summary extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    onClickNext() {
        const { actions, trainFile} = this.props;

        actions.changeMainTab(Constants.SUMMARY_KEY);
    }

    onTypeChange(idx, type) {
        console.log(`Type of column ${idx} is changed to '${type}'`);
    };

    renderTypeEntries(idx, type) {
        const type2Show = Constants.colType2Type(type);
        return (
            <Form.Control as="select" value={type2Show}
                onChange={(evt) => this.onTypeChange(idx, evt.target.value)}>
                <option>Numeric</option>
                <option>Enum</option>
            </Form.Control>
        );
    };

    renderSummaryData(cols = []) {
        let row = 0;
        const listItems = cols.map((col, idx) => (
            <tr>
                <td>{++row}</td>
                <td>{col.label}</td>
                <td>{this.renderTypeEntries(idx, col.type)}</td>
                <td>false</td>
                <td>false</td>
                <td>{col.missing_count}</td>
                <td>?</td>
            </tr>
       ));
       return (
        <tbody>{listItems}</tbody>
       );
    }

    render() {
        const { summary, actions, statePath, trainFile} = this.props;
        const cols = _.get(trainFile, 'parsedData.frames[0].columns');

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Summary of Train File</Card.Title>
                    <Card.Text>
                        The following is summary of imported train file. If any column type is changed, then the data
                        should be analysed again.
                    </Card.Text>
                    <Form
                        id="summary-form"
                    >
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Field</th>
                                    <th>Type</th>
                                    <th>Flag</th>
                                    <th>Unique</th>
                                    <th>Missing</th>
                                    <th>Outliers</th>
                                </tr>
                            </thead>
                            {this.renderSummaryData(cols)}
                        </Table>
                    </Form>
                </Card.Body>
            </Card>
        );
    }

}

Summary.propTypes = {
    statePath: PropTypes.string.isRequired,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Summary);


