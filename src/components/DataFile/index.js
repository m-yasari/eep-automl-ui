import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Collapse from 'react-bootstrap/Collapse';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import mapDispatchToProps from '../../actions/creator';
import Constants from '../../constants';

const mapStateToProps = (state, ownProps) => {
    return ({ importFile: _.get(state, ['dataFile', ownProps.category]) });
}

class ImportFile extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.filenameInput = React.createRef();
    }
  
    filenameChange(evt) {
        const { actions, category } = this.props;
        actions.importFilename(category, evt.target.value);
    }

    render() {
        const { importFile, fileLabel } = this.props;

        return (
            <Form.Group>
                <Form.Group as={Row} controlId={`validationFormSource-${fileLabel}`}>
                    <Form.Label id={`sourceFileLabel-${fileLabel}`}>
                        {fileLabel + " File:"}
                    </Form.Label>
                    <Col sm={8}>
                        <Row>
                            <Form.Control
                                type="input"
                                disabled={importFile.parsed || importFile.inProgress}
                                ref={this.filenameInput}
                                aria-describedby={`sourceFileLabel-${fileLabel}`}
                                name={`sourceFile-${fileLabel}`}
                                onChange={(evt) => this.filenameChange(evt)}
                            />
                        </Row>
                        <Row>
                            <Form.Control.Feedback type="invalid">
                                {importFile.formErrors}
                            </Form.Control.Feedback>
                        </Row>
                    </Col>
                    <Col sm={2}>
                        <Button onClick={() => this.onClickImport()}
                            disabled={importFile.parsed || importFile.inProgress || importFile.name.length === 0}
                            variant={(!importFile.parsed && !importFile.inProgress && importFile.name.length > 0) ? 
                                "primary" : "secondary"} >
                            <Collapse in={importFile.inProgress}>
                                <Spinner as="span"
                                    animation="grow" size="sm"
                                    role="status" aria-hidden="true"
                                    />
                            </Collapse>
                            Import
                        </Button>
                    </Col>
                </Form.Group>
                <Row>
                    <Col>
                        <Collapse in={importFile.inProgress || importFile.parsed}>
                            <ProgressBar animated={importFile.progress < 100}
                                now={importFile.progress} 
                                label={`${importFile.progress}% ${importFile.progress===100 ? "Imported" : ""}`}
                                variant={importFile.apiError ? "danger" : "success"}
                                />
                        </Collapse>
                    </Col>
                </Row>
                <Collapse in={importFile.apiError}>
                    <Row>
                        <Alert varient="warning">{importFile.apiError}</Alert>
                    </Row>
                </Collapse>
                <Collapse in={importFile.inProgress}>
                    <Row>
                        <Alert 
                            varient="success">
                            {importFile.progress<100 ? importFile.progressMsg : "Imported"}
                        </Alert>
                    </Row>
                </Collapse>
            </Form.Group>
        );
    }

    onClickImport() {
        const { statePath, actions, category } = this.props;
        const currentStatePath = `${statePath}.${category}`;

        const filename = this.filenameInput.current.value;

        if (filename && filename.length>0) {
            actions.importDataFileStart(category, filename);
            actions.callImportFile(category);
        } else {
            actions.changeState(currentStatePath, 'To import, filename is mandatory!', 'formErrors.sourceFile');
        }
    }
}

ImportFile.propTypes = {
    statePath: PropTypes.string.isRequired,
    category: PropTypes.oneOf(['train', 'test']).isRequired,
    fileLabel: PropTypes.string.isRequired,
    onImport: PropTypes.func,
};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ImportFile);
