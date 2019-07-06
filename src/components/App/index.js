import React from 'react';
import Header from '../Header';
import Greeting from '../Greeting';
import Container from 'react-bootstrap/Container';

class App extends React.Component {
    render() {
        return (
        <Container>
            <Header />
            <Greeting />
        </Container>
        );
    }
}

export default App;