import React from 'react';
import Header from '../Header';
import Main from '../Main';
import Container from 'react-bootstrap/Container';

class App extends React.Component {
    render() {
        return (
        <Container>
            <Header />
            <Main />
        </Container>
        );
    }
}

export default App;