
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.scss';

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloseButton from 'react-bootstrap/CloseButton';

const Login = () => {
  const navigate = useNavigate();
  return (
    <Container fluid className='vh-100'>
        <Row className="vh-100 justify-content-center text-start">
        <Col lg={7} className="d-none d-md-block" style={{backgroundImage: `url('https://picsum.photos/1200/1200')`}}>
        </Col>
        <Col md={12} lg={5} className="d-flex flex-column justify-content-center p-5">
          <CloseButton className="position-absolute top-0 end-0 m-3" onClick={()=>navigate("/")}/>
          <Form>
          <h1 className="text-center mb-5">Login</h1>
            <Form.Group controlId="formEmail" className="mb-5">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                size="lg"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-5">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                required
                size="lg"
              />
              <Form.Text>Forgot your password? Click <a>here</a></Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-lg w-100">
              Login
            </Button>
            <Form.Text>Don't have an account? Click <a href='/register'>here</a> to register</Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;