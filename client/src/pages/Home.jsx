
import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Row, Button, Col, Card, CardGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

const Home = () => {
  return (
    <Container fluid className='--bg-secondary p-4'>
        <Row className='justify-content-md-center'>
            <Col xs={12} lg={9}>
                <Card className='px-5 py-4 mx-2 mb-4'>
                    <Card.Body>
                        <Card.Text className="--text-xl">Welcome to Flashcard-site</Card.Text>
                        <Card.Text className='fs-5'>
                        Sign up to begin your journey with flashcards and access a wide collection of revision materials. I would put more text but idk what else to say
                        </Card.Text>
                        <Button variant="primary" className="btn-lg mt-4 mx-3 d-inline">Log In</Button>
                        <Button variant="primary" className="btn-lg mt-4 mx-3 d-inline">Sign Up</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className='justify-content-md-center'>
            <Col xs={12} lg={9}>
            <CardGroup>
                <Card className='mx-2'>
                <Card.Img variant="top" src="https://picsum.photos/seed/123/280/160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in
                        to additional content. This content is a little bit longer.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card className='mx-2'> 
                    <Card.Img variant="top" src="https://picsum.photos/seed/234/280/160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This card has supporting text below as a natural lead-in to
                        additional content.{' '}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card className='mx-2'>
                <Card.Img variant="top" src="https://picsum.photos/seed/345/280/160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in
                        to additional content. This card has even longer content than the
                        first to show that equal height action.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                </CardGroup>
            </Col>
        </Row>
        
        
        
    </Container>
  );
};

export default Home;