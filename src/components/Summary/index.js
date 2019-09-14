import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table'
import Collapse from 'react-bootstrap/Collapse';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { type } from 'os';

const mapStateToProps = state => {
    return ({ summary: state.summary, trainFile: state.dataFile.train });
}

/**
* @param num The number to round
* @param precision The number of decimal places to preserve
*/
const roundUp = (num, precision) => {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
};

class Summary extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    onClickNext() {
        const { actions} = this.props;
        actions.changeMainTab(Constants.TRAIN_KEY);
        actions.setDisableTrainFlag(false);
    }

    onReparseClick() {
        const { actions} = this.props;
        actions.reparse(Constants.TRAIN_DATA);
    }

    onTypeChange(idx, type) {
        const { actions } = this.props;
        actions.changeColumnType(idx, type);
    };

    onFlagChange(idx, evt, target) {
        const { actions } = this.props;
        actions.changeColumnFlag(idx, evt.target.checked);
    };

    onTargetChange(idx) {
        const { actions } = this.props;
        actions.changeColumnFlag(idx, false);
        actions.changeTargetColumn(idx);
    };

    renderTypeEntries(idx, type) {
        return (
            <Form.Control as="select" value={type}
                onChange={(evt) => this.onTypeChange(idx, evt.target.value)}>
                <option>Numeric</option>
                <option>Enum</option>
                <option>String</option>
                <option>Time</option>
            </Form.Control>
        );
    };

    renderFlagEntries(idx, flag, target) {
        return (
            <Form.Check type="checkbox" aria-label="Select field to consider it as a factor." 
                {...(flag ? "checked" : "")} 
                onChange={(evt) => this.onFlagChange(idx, evt, target)}
                />
        );
    };

    renderTargetEntries(idx, flag) {
        return (
            <Form.Check type="radio" aria-label="Select as target."
                name="target-field" 
                {...(flag==idx ? "checked" : "")} 
                onChange={() => this.onTargetChange(idx)}
                />
        );
    };

    renderSummaryData(cols = [], selectedColumns, target) {
        let row = 0;
        const listItems = cols.map((col, idx) => (
            <tr>
                <td>{++row}</td>
                <td>{col.label}</td>
                <td>{this.renderTargetEntries(idx, target)}</td>
                <td>{this.renderTypeEntries(idx, col.type)}</td>
                <td>{this.renderFlagEntries(idx, selectedColumns.indexOf(idx)!==-1, target)}</td>
                <td>?</td>
                <td>{col.missing_count}</td>
                <td>{roundUp(col.mean, 3)}</td>
                <td>{roundUp(col.sigma, 3)}</td>
            </tr>
        ));
       return (
        <tbody>{listItems}</tbody>
       );
    }

    render() {
        const { summary, statePath, trainFile} = this.props;
        const cols = summary.columns, selectedColumns = summary.selectedColumns;

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
                                    <th>Target</th>
                                    <th>Type</th>
                                    <th>Flag</th>
                                    <th>Unique</th>
                                    <th>Missing</th>
                                    <th>Mean</th>
                                    <th>Sigma</th>
                                </tr>
                            </thead>
                            {this.renderSummaryData(cols, selectedColumns, summary.target)}
                        </Table>
                    </Form>
                    <Collapse in={summary.reparseRequired}>
                        <Button
                            onClick={() => this.onReparseClick()}
                            disabled={trainFile.inProgress}
                            variant="primary"
                            >
                            Re-parse
                        </Button>
                    </Collapse>
                    <Collapse in={trainFile.inProgress}>
                        <ProgressBar animated="true"
                            now={trainFile.progress} 
                            label={`${trainFile.progress}%`}
                            variant={trainFile.apiError ? "danger" : "success"}
                            />
                    </Collapse>
                    <Button
                        onClick={() => this.onClickNext()}
                        disabled={trainFile.inProgress}
                        variant={trainFile.parsed ? "primary" : "secondary"}
                        >
                        Next
                    </Button>
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


