import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../actions/creator';
import { Tabs, Tab, Row, Collapse, Button } from 'react-bootstrap';
import Capture from '../Capture';
import Summary from '../Summary';
import * as Constants from '../../constants';
import Train from '../Train';
import Leaderboard from '../Leaderboard';
import Predict from '../Predict';

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
  
    componentDidMount() {
        const { actions } = this.props;
        actions.callGetEnvironment();
    }

    render() {
        const { main, summary, train } = this.props;

        return (
            <>
            <Row>
            <Collapse in={main.activeKey === Constants.CAPTURE_KEY}>
                <div>
                Project Scout provides AutoML capabilities for users with minimal knowledge of AI/ML.<br />
                Find more information on this <a href="#" 
                    onClick={()=> this.onWhitePaperClick()}
                    >whitepaper</a>.  
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