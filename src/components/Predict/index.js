import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import DataFile from '../DataFile';
import Step from '../Step';
import Badge from 'react-bootstrap/Badge';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import { roundUp } from '../../constants/utils';

const mapStateToProps = state => {
    return ({ predict: state.predict, testFile: state.dataFile.test });
}

class Predict extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    onClickLeaderboard() {
        const { actions } = this.props;
        actions.changeMainTab(Constants.LEADERBOARD_KEY);
    }

    onClickPredict() {
        const { actions } = this.props;
        actions.callPredict();
    }
    
    renderModelMetrics(metrics) {
        const columnsHeader = metrics.columns;
        const columnData = metrics.data;
        const rowCount = metrics.rowcount;

        return (
        <>
        <div>
            <br />
            <hr />
            <b>Confusion Matrix</b> shows the accuracy of the selected model, where in each row shows the result of prediction of train data, compared with the actual value in train data.
        </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th></th>
                    <th key="PredictedClass" colSpan={columnsHeader.length+2}>Predicted Class</th>
                </tr>
                <tr>
                    <th key="name0">Actual Class</th>
                    {columnsHeader.map((columnHead, index) => (
                        <th key={index}>{columnHead.name}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                { columnData[0].map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td key="col0">
                            {(rowIndex===rowCount-1) ? "Total" : columnsHeader[rowIndex].name}
                        </td>
                        { columnsHeader.map((column, columnIndex) => {
                            let value = columnData[columnIndex][rowIndex];
                            if (column.type === 'double') {
                                if (column.name === "Error") {
                                    value = roundUp(value * 100, 2);
                                } else {
                                    value = roundUp(value, 4);
                                }
                            }
                            return (<td key={columnIndex}>{value}</td>);
                        }) }
                    </tr>
                )) }
            </tbody>
        </Table>
        </>
        );
    }

    render() {
        const { predict, actions, statePath, testFile} = this.props;
        const metrics = _.get(predict, "modelMetrics.model_metrics[0].cm.table", null);

        return (
            <Card>
                <Card.Body> 
                    <Card.Title>Predict a Test File</Card.Title>
                    <Card.Text>
                        Enter URL of a test file in below field, then press Import button to load the data for prediction based on the selected model.<br />
                        e.g.: https://storage.googleapis.com/my-eep-bucket/ML-project/Titanic/test.csv<br />
                        Once the test file imported, then press 'Predict' button to predict based on selected model.<br />
                        After prediction completed, 'Download Predict' button can be used to download the predicted file in CSV format.<br />
                        <b>Note: </b>Currently, only CSV format is supported.
                    </Card.Text>
                    <Form
                        id="capture-form"
                    >
                        <DataFile 
                            statePath={statePath} 
                            fileLabel="Test"
                            category="test" />
                        <Row>
                            Selected Model: <Badge variant="success">{predict.model}</Badge>
                            <Button onClick={() => this.onClickPredict()}
                                disabled={!testFile.parsed}
                                variant={testFile.parsed ? "primary" : "secondary"} >
                                Predict
                            </Button>
                            <Collapse in={predict.predicted}>
                                <Button href={`/api/3/DownloadDataset?frame_id=${predict.predictFrame}`}>
                                    Download Prediction
                                </Button>
                            </Collapse>
                        </Row>
                        <Row>
                            { metrics ? this.renderModelMetrics(metrics) : "" }
                        </Row>
                        <Row className="justify-content-md-right">
                            <Button onClick={() => this.onClickLeaderboard()} >
                                Leaderboard
                            </Button>
                        </Row>
                    </Form>
                   
                </Card.Body>
            </Card>
        );
    }

}

Predict.propTypes = {
    statePath: PropTypes.string.isRequired,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Predict);


