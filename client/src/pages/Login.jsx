
import React from 'react';
import { Container, Button, Modal, Form, FormGroup, Stack } from 'react-bootstrap';
import '../App.scss';

const Login = () => {
  return (
    <Container fluid className='--bg-secondary p-5'>
        <div
      className="modal show text-start"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header className="pb-1 d-flex justify-content-center">
          <Modal.Title className="fs-2">Login</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4">
            <Form>
        <Form.Group className="mt-3 mb-4" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <FormGroup className="mt-5">
            <Stack className="d-flex flex-column align-items-center">
                <Button variant="primary" type="submit" className="w-50 py-2">
                    Log In
                </Button>
                <Form.Text muted>
                    Don't have an account yet? Sign up <a href=''>here</a>
                </Form.Text>
            </Stack>
        </FormGroup>
        
        </Form>
        </Modal.Body>
      </Modal.Dialog>
    </div>
    </Container>
  );
};

export default Login;