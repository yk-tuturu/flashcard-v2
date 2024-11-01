import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import SubjectCard from "../components/SubjectCard"

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const Browse = () => {
    return (
        <Container fluid className="--bg-secondary p-3 fill-screen">
            <Row className="w-100 justify-content-md-center">
                <Col sm={12} md={8}>
                    <h1>Search for flashcards</h1>
                    <p>Find flashcards decks by keywords or subject</p>
                    <InputGroup className="mb-5">
                        <Form.Control
                        type="text"
                        placeholder="Search..."
                        size="lg"
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row className="text-start w-100 justify-content-md-center">
            <Col sm={12} lg={8}>
                <h2 className="mb-4">Or browse by subject</h2>
                <Row xs={1} md={2} lg={3}  className="g-4">
                    <Col><SubjectCard/></Col>
                    <Col><SubjectCard/></Col>
                    <Col><SubjectCard/></Col>
                    <Col><SubjectCard/></Col>
                    <Col><SubjectCard/></Col>
                    <Col><SubjectCard/></Col>
                </Row>
            </Col>
            </Row>
            
            
        </Container>
    )
}

export default Browse;