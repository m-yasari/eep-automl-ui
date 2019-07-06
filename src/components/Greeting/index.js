import React from 'react';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import Hello from '../Hello';
import Entry from '../Entry';
import ListGroup from 'react-bootstrap/ListGroup';
import 'whatwg-fetch';

const mapStateToProps = state => ({ names: state.names });

class Greeting extends React.Component {
    constructor(props) {
        super(props);
        this.loadInitialList();
    }
    loadInitialList() {
        let { actions } = this.props;

        fetch("/api/names.json", {
            method: "GET"
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            actions.loadAllNames(result);
        }).catch(function(error) {
            console.error("Failed to fetch initial names!", error.message);
        });
    }
    render() {
        let { names, actions } = this.props;
        return (
        <div>
            <Entry />
            <ListGroup class="col-sm-2" >
            {names.map((name, index) => (
                <Hello key={index} {...name} onClick={() => actions.removeName(name.id)}/>
            ))}
            </ListGroup>
        </div>
        );
    }

}

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Greeting);
