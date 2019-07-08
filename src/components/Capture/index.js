import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ImportFile from '../ImportFile';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import Constants from '../../constants';

const mapStateToProps = state => {
    return ({ capture: state.capture });
}

class Capture extends Step {
    constructor(props, context) {
        super(props, context);
    }
  
    render() {
        const { capture, actions, statePath} = this.props;

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Import Source File</Card.Title>
                    <Card.Text>
                        Enter URL of train and test files, then import to load for analysis and training.
                    </Card.Text>
                    <Form
                        id="capture-form"
                        validated={capture.validated}
                    >
                        <ImportFile 
                            statePath={statePath} 
                            fileLabel="Train"
                            category="train"
                            onImport={this.validate} />
                        <ImportFile 
                            statePath={statePath} 
                            fileLabel="Test" 
                            category="test"
                            onImport={this.validate} />
                    </Form>
                    <Row>
                        <Col>
                            <Collapse in={capture.inProgress}>
                                <ProgressBar animated 
                                    now={capture.inProgress} 
                                    label={`${capture.inProgress}%`}
                                    variant={capture.importResult}
                                    />
                            </Collapse>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="float-right" 
                                variant={capture.parseValidated ? 'primary' : 'secondary'}
                                disabled={!capture.parseValidated} >Parse</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }

    validate() {
        const { capture, actions } = this.props;

    }
}

Capture.propTypes = {
    statePath: PropTypes.string.isRequired,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Capture);


