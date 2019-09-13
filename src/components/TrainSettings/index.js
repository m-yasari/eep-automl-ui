import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import DataFile from '../DataFile';
import Step from '../Step';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import * as Constants from '../../constants';
import Table from 'react-bootstrap/Table';
import {Modal} from 'react-bootstrap';

const mapStateToProps = state => {
    return ({ train: state.train});
}
 
class TrainSettings extends Step{

    constructor(props, context){
        super(props, context);
        this.projectNameInput = React.createRef();
        this.maxTrainTimeInput = React.createRef();
    }

    onApplyClick() {
        const { actions } = this.props;

        let maxTrainTime = 3600;
        try {
            maxTrainTime = parseInt(this.maxTrainTimeInput.current.value);
            //TODO: validate projectName value
        } catch(e) {}
        actions.applyTrainSettings({
            maxTrainTime: maxTrainTime,
            projectName: this.projectNameInput.current.value
        });
    }

    render() {
        const {closePopup, train } = this.props;

        return (
            <Modal show={train.showPopup}
               onHide={closePopup}
               aria-labelledby="contained-modal-title-vcenter"
               centered
               >
                <Modal.Header closeButton>
                    <Modal.Title>Train - setting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Setting</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Project name (H2O)</td>
                                <td>
                                    <Form.Control type="input"
                                        name="projectNameInput"
                                        ref={this.projectNameInput} 
                                        maxLength="60" defaultValue={train.projectName}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Max training run time (H2O) - seconds</td>
                                <td>
                                    <Form.Control type="input"
                                        name="maxTrainTimeInput"
                                        ref={this.maxTrainTimeInput} 
                                        maxLength="6" defaultValue={train.maxTrainTime}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    </Form.Group>
                    <Button variant="primary" onClick={() => this.onApplyClick()}>Apply</Button>
                </Modal.Body>
            </Modal>
        );
    }
}

TrainSettings.propTypes = {
    closePopup : PropTypes.func.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainSettings);
