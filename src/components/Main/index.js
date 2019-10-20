import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import { Tabs, Tab, Row, Collapse, Alert, Spinner, Button } from 'react-bootstrap';
import Capture from '../Capture';
import Summary from '../Summary';
import * as Constants from '../../constants';
import * as _ from 'lodash';
import Train from '../Train';
import Leaderboard from '../Leaderboard';
import Predict from '../Predict';
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';

const mapStateToProps = state => ({ main: state.main });

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.mainTab = React.createRef();
    }

    onWhitePaperClick() {
        window.open("https://alm-confluence.systems.uk.hsbc/confluence/display/EEP18AIML/Whitepaper+for+Project+Scout",
            "_whitepaper");
    }

    onResetClick() {
        const { main, actions } = this.props;
        if (!main.resetInProgress) {
            actions.resetStart();
            actions.callRemoveAllData();
        }
    }
  
    componentDidMount() {
        const { actions } = this.props;
        actions.callGetEnvironment();
    }

    renderReset(main) {
        return (
            <div>
                To reset all frames and models in the ML engine click on -&gt; 
                <a href="#" onClick={()=> this.onResetClick()}>Reset</a>.
                <Collapse in={main.resetInProgress}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">...Resetting</span>
                    </Spinner>
                </Collapse>
                <Collapse in={main.resetErrors.length > 0}>
                <div>
                    <Alert varient="warning">Reset failed: {_.get(main, "resetErrors[0].value", "")}</Alert>
                </div>
                </Collapse>
            </div>
        );
    }

    render() {
        const { main } = this.props;

        return (
            <>
            <Row>
            <Collapse in={main.activeKey === Constants.CAPTURE_KEY}>
                <div>
                Project Scout provides AutoML capabilities for users with minimal knowledge of AI/ML.<br />
                Find more information on this <a href="#" 
                    onClick={()=> this.onWhitePaperClick()}
                    >whitepaper</a>.
                {/*this.renderReset(main)*/}
                </div>         
            </Collapse>
            </Row>
            <Tabs
                id="main-controlled-tab"
                ref={this.mainTab}
                activeKey={main.activeKey}
                onSelect={(key,event) => this.onSelectTab(key, event)}
            >
                <Tab eventKey={Constants.CAPTURE_KEY} title="Capture">
                    <Capture statePath='capture' />
                </Tab>
                <Tab eventKey={Constants.SUMMARY_KEY} title="Summary" disabled={main.disableSummaryTab}>
                    <Summary statePath='summary' />
                </Tab>
                <Tab eventKey={Constants.TRAIN_KEY} title="Train" disabled={main.disableTrainTab}>
                    <Train statePath='train' />
                </Tab>
                <Tab eventKey={Constants.LEADERBOARD_KEY} title="Leaderboard" disabled={main.disableLeaderboardTab}>
                    <Leaderboard statePath='leaderboard' />
                </Tab>
                <Tab eventKey={Constants.PREDICT_KEY} title="Predict" disabled={main.disablePredictTab}>
                    <Predict statePath='predict' />
                </Tab>
            </Tabs>
            </>
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