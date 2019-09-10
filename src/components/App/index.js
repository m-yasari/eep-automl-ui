import React from 'react';
import Header from '../Header';
import Main from '../Main';
import Container from 'react-bootstrap/Container';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCog } from '@fortawesome/free-solid-svg-icons';

library.add(faCheckSquare, faCog);

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