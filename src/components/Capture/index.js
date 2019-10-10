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

const mapStateToProps = state => {
    return ({ capture: state.capture, trainFile: state.dataFile.train });
}

class Capture extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    onClickNext() {
        const { actions, trainFile} = this.props;
        actions.changeMainTab(Constants.SUMMARY_KEY);
        actions.setDisableSummaryFlag(false);
    }

    render() {
        const { capture, actions, statePath, trainFile} = this.props;

        return (
            <Card>
                <Card.Body> 
                    <Card.Title>Import Source File</Card.Title>
                    <Card.Text>
                        Start AutoML by loading a train data file.<br/>
                        Enter URL of a train file in below field, then press Import button to load the data for analysis and training.<br />
                        e.g.: https://storage.googleapis.com/my-eep-bucket/ML-project/Titanic/train.csv<br />
                        <b>Note: </b>Currently, only CSV format is supported.
                    </Card.Text>
                    <Form
                        id="capture-form"
                    >
                        <DataFile 
                            statePath={statePath} 
                            fileLabel="Train"
                            category="train" />
                        <Row className="justify-content-md-right">
                            <Button onClick={() => this.onClickNext()}
                                disabled={!trainFile.parsed}
                                variant={trainFile.parsed ? "primary" : "secondary"} >
                                Next
                            </Button>
                        </Row>
                    </Form>
                   
                </Card.Body>
            </Card>
        );
    }

}

Capture.propTypes = {
    statePath: PropTypes.string.isRequired,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Capture);


