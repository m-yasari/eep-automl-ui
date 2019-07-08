import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import mapDispatchToProps from '../../actions/creator';
import Constants from '../../constants';

const mapStateToProps = (state, ownProps) => {
    return ({ importFile: _.get(state, ownProps.statePath) });
}

class ImportFile extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.filenameInput = React.createRef();
    }
  
    render() {
        const { importFile, actions, fileLabel } = this.props;

        return (
            <Form.Group as={Row} controlId={`validationFormSource-${fileLabel}`}>
                <Form.Label sm={2}  id={`sourceFileLabel-${fileLabel}`}>
                    {fileLabel} File:
                </Form.Label>
                <Form.Control
                    type="input"
                    ref={this.filenameInput}
                    sm={8}
                    aria-describedby={`sourceFileLabel-${fileLabel}`}
                    name={`sourceFile-${fileLabel}`}
                    isInvalid={!!importFile.errors.sourceFile}
                />
                <Form.Control.Feedback type="invalid">
                    {importFile.errors.sourceFile}
                </Form.Control.Feedback>
                <Button variant="primary" onClick={() => this.onClickImport()}>
                    <Collapse in={importFile.inProgress}>
                        <Spinner as="span"
                            animation="grow" size="sm"
                            role="status" aria-hidden="true"
                            />
                    </Collapse>
                    Import
                </Button>
            </Form.Group>
        );
    }

    onClickImport() {
        const { statePath, actions, category } = this.props;

        const filename = this.filenameInput.current.value;

        if (filename && filename.length>0) {
            actions.resetState(statePath);
            actions.importFileStart(category, filename);
            actions.callImportFile(category, filename );
        } else {
            actions.changeState(statePath, 'To import, filename is mandatory!', 'errors.sourceFile');
        }
    }
}

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ImportFile);
