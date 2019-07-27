import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import { Tabs, Tab } from 'react-bootstrap';
import Capture from '../Capture';
import Summary from '../Summary';
import Step from '../Step';
import * as Constants from '../../constants';

const mapStateToProps = state => ({ main: state.main });

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.mainTab = React.createRef();
    }
  
    render() {
        const { main, actions } = this.props;

        return (
            <Tabs
                id="main-controlled-tab"
                ref={this.mainTab}
                activeKey={main.activeKey}
                onSelect={(key,event) => this.onSelectTab(key, event)}
            >
                <Tab eventKey={Constants.CAPTURE_KEY} title="Capture">
                    <Capture statePath='capture' />
                </Tab>
                <Tab eventKey={Constants.SUMMARY_KEY} title="Summary" disabled>
                    <Summary statePath='summary' />
                </Tab>
                <Tab eventKey={Constants.TRAIN_KEY} title="Train" disabled>
                    <Step />
                </Tab>
                <Tab eventKey={Constants.LEADERBOARD_KEY} title="Leaderboard" disabled>
                    <Step />
                </Tab>
            </Tabs>
        );
    }

    onSelectTab(key, event) {
        console.log("key:", key, " event:", event);
    }

}

Main.propTypes = {

};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main);