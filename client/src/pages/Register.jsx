import {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.scss';
import axios from "axios";

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloseButton from 'react-bootstrap/CloseButton';

const Register = () => {
    const navigate = useNavigate();

    const [info, setInfo] = useState({
      username: "",
      email: "", 
      password: ""
    })

    const [error, setError] = useState("")

    const onChange = (e) => {
      setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
      console.log(info);
    }

    const onClick = async(e) => {
      e.preventDefault();
      try {
        await axios.post("http://localhost:8800/auth/register", info).then(function(response){
          navigate("/login");
        })
      } catch(err) {
        console.log(err);
        setError(err.response);
      }
    }

  return (
    <Container fluid className='vh-100'>
        <Row className="w-100 vh-100 justify-content-center text-start">
        <Col lg={7} className="d-none d-md-block" style={{backgroundImage: `url('https://picsum.photos/1200/1200')`}}>
        </Col>
        <Col md={12} lg={5} className="d-flex flex-column justify-content-center p-5">
            <CloseButton className="position-absolute top-0 end-0 m-3" onClick={()=>navigate("/")}/>
          <Form>
          <h1 className="text-center mb-5">Register</h1>
            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                required
                size="lg"
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group controlId="formUsername" className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                required
                size="lg"
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-5">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                required
                size="lg"
                onChange={onChange}
              />
              <Form.Text>Password more than 8 alphanumeric characters</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-lg w-100" onClick={onClick}>
              Register
            </Button>
            <Form.Text>Already have an account? Click <a href='/login'>here</a> to login</Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;