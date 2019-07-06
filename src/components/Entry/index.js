import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import * as _ from 'lodash';
import mapDispatchToProps from '../../actions/creator';

class Entry extends React.Component {
    constructor(props) {
        super(props)
        this.aNameInput = React.createRef();
    }
    render() {
        return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="a-name-label">Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    id = "aName"
                    ref = { this.aNameInput }
                    placeholder="First Name"
                    aria-label="First Name"
                    aria-describedby="aName-label"
                />
                <Button variant="primary" onClick={ () => this.onClick() }>Add</Button>
            </InputGroup>
        </div>
        )
    }

    onClick() {
        let { actions } = this.props;
        let aName = _.get(this, "aNameInput.current.value");
        
        aName && actions.addName(aName);
    }
};

export default connect(
    null,
    mapDispatchToProps
  )(Entry);
  