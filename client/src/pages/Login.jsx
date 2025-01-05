import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from "axios";

import '../styles/App.scss';
import { AuthContext } from "../context/authContext";

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloseButton from 'react-bootstrap/CloseButton';

const Login = () => {
    const navigate = useNavigate();

    const [info, setInfo] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState(null)

    axios.defaults.withCredentials = true;

    // update login info
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(info)
    };

    const { login } = useContext(AuthContext);

    // submit login
    const handleClick = async (e) => {
        e.preventDefault()
        try {
            await login(info)
            navigate("/")
        } catch (err) {
            setError(err.response.data)
        }
    };
    return (
        <Container fluid className='vh-100'>
            <Row className="vh-100 justify-content-center text-start">
                <Col lg={7} className="d-none d-md-block" style={{ backgroundImage: `url('https://picsum.photos/1200/1200')` }}>
                </Col>
                <Col md={12} lg={5} className="d-flex flex-column justify-content-center p-5">
                    <CloseButton className="position-absolute top-0 end-0 m-3" onClick={() => navigate("/")} />
                    <Form>
                        <h1 className="text-center mb-5">Login</h1>
                        <Form.Group controlId="formUsername" className="mb-4">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                required
                                size="lg"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-4">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                required
                                size="lg"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                size="lg"
                                onChange={handleChange}
                            />
                            <Form.Text>Forgot your password? Click <a>here</a></Form.Text>
                        </Form.Group>
                        <p className="error-text">{error}</p>
                        <Button variant="primary" type="submit" className="btn-lg w-100" onClick={handleClick}>
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