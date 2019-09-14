import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import DataFile from '../DataFile';
import Step from '../Step';
import Badge from 'react-bootstrap/Badge';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';

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
        const { actions, testFile} = this.props;
        actions.predict(testFile);
    }

    render() {
        const { predict, actions, statePath, testFile} = this.props;

        return (
            <Card>
                <Card.Body> 
                    <Card.Title>Import Test File</Card.Title>
                    <Card.Text>
                        Enter URL of test file, then import to load for prediction.
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
                        </Row>
                        <Row className="justify-content-md-right">
                            <Button onClick={() => this.onClickPredict()}
                                disabled={!testFile.parsed}
                                variant={testFile.parsed ? "primary" : "secondary"} >
                                Predict
                            </Button>
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


