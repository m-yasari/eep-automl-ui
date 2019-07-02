import React from 'react';
import {render} from 'react-dom';
import Header from '../Header';
import Greeting from '../Greeting';

class App extends React.Component {
    render() {
        return (
        <div>
            <Header />
            <Greeting />
        </div>
        );
    }
}

export default App;