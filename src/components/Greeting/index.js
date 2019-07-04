import React from 'react';
import {connect} from 'react-redux';
import * as actions from './actions';
import {Hello} from '../Hello';
import {Entry} from '../Entry';
import ListGroup from 'react-bootstrap/ListGroup';
import 'whatwg-fetch';

const mapStateToProps = (state) => (
    {
      names: state.names
    }
);

const mapDispatchToProps = (dispatch) => (
    {
        onClick: (id) => {
            dispatch(actions.removeName(id));
        },
        onAdd: (name) => {
            dispatch(actions.addName(name));
        },
        onInit: (list) => {
            dispatch(actions.loadAll(list));
        }
    }
);

class Greeting extends React.Component {
    constructor(props) {
        super(props);
        this.loadInitialList();
    }
    loadInitialList() {
        let onInit = this.props.onInit;
        fetch("/api/names.json", {
            method: "GET"
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            onInit(result);
            let initIndex = 0;
            result.forEach(function(entry) {
                initIndex = initIndex>entry.id ? initIndex : entry.id;
            });
            actions.setNextId(initIndex);
        }).catch(function(error) {
            console.error("Failed to fetch initial names!", error.message);
        });
    }
    render() {
        let names = this.props.names;
        let onClick = this.props.onClick;
        let onAdd = this.props.onAdd;
        return (
        <div>
            <Entry onAdd={onAdd} />
            <ListGroup class="col-sm-2" >
            {names.map((name, index) => (
                <Hello key={index} {...name} onClick={() => onClick(name.id)}/>
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
