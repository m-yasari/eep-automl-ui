import React from 'react';
import { Image, Row }  from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
        <>
            <div><Image src='img/logo.jpg'/></div>
            <Row>
                <h1>Project Scout (AI/ML Quick Start Tool)</h1>
            </Row>
        </>
        );
    }
}

export default Header;