import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Edit = () => {
    return (
        <Container fluid className="--bg-secondary fill-screen text-start px-5 pt-5 d-flex justify-content-center">
            <Col xs={12} md={12} lg={9}>
                <h2>Edit Flashcard Details</h2>
                <Row xs={1} md={2}>
                    <Col>
                    <Form.Group className="mb-4">
                        <Form.Label>Flashcard Set Title</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter title"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Select Subject</Form.Label>
                        <Form.Select aria-label="Default select example">
                        <option>Choose a subject</option>
                        <option value="1">Sciences</option>
                        <option value="2">Social Sciences</option>
                        <option value="3">Arts and Humanities</option>
                        <option value="3">Math</option>
                        <option value="3">Languages</option>
                        <option value="3">Others</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-4">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="email"
                            placeholder="Enter email"
                            rows={5}
                        />
                    </Form.Group>
                    </Col>
                </Row>
                <h2>Edit Flashcards</h2>
                
               
                <Row xs={1} md={2} className="g-4 mb-4">
                    <Col>
                        <ReactQuill theme="snow"/>
                    </Col>
                    <Col>
                        <ReactQuill theme="snow"/>
                    </Col>
                </Row>
                <Row xs={1} md={2} className="g-4 mb-4">
                    <Col>
                        <ReactQuill theme="snow"/>
                    </Col>
                    <Col>
                        <ReactQuill theme="snow"/>
                    </Col>
                </Row>
            </Col>
           
        </Container>
    )
}

export default Edit;