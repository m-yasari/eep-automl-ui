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
import Table from 'react-bootstrap/Table';
import FontAwesomne from 'react-fontawesome';
import {Modal} from 'react-bootstrap';

const mapStateToProps = state => {
    return ({ train: state.train});
}
 
class TrainSettings extends Step{

    constructor(props, context){
        super(props, context);
    }

    render() {
        const {closePopup, train } = this.props;

console.log("this.props", this.props)

        return (
            <>
               <Modal show={train.showPopup}
               onHide={closePopup}
               aria-labelledby="contained-modal-title-vcenter"
               centered
               >
                   <Modal.Header closeButton>
                       <Modal.Title> Train - setting</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                       <Table striped bordered hover>
                           <thead>
                               <tr>
                                   <th>
                                       Setting
                                   </th>
                                   <th>
                                       Default
                                   </th>
                                   <th>
                                       Value
                                   </th>
                               </tr>
                           </thead>
                           <tbody>
                               <tr>
                                   <td>Project name (h2o)</td>
                                   <td>AutoML_20190809003012</td>
                                   <td></td>
                               </tr>
                               <tr>
                                   <td>Max models (h2o)</td>
                                   <td>
                                       <Form.Group controlId="Select">
                                           <Form.Control as="select">
                                               <option>Yes</option>
                                               <option>No</option>
                                           </Form.Control>
                                       </Form.Group>
                                   </td>
                               </tr>
                           </tbody>
                       </Table>
                   </Modal.Body>
               </Modal>
            </>
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
