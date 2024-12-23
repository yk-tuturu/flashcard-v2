import {useState, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import { AuthContext } from "../context/authContext";

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

import axios from "axios";

const Create = () => {
    const [info, setInfo] = useState({title: "", subject: "", description: ""})
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser) {
          navigate("/login")
        }
    }, [currentUser])

    const handleInfoChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
    }
    
    const submitInfo = async(e) => {
        e.preventDefault();
        
        try{
            const data = {...info, user_id: currentUser.id}
            await axios.post("http://localhost:8800/cards/create", data).then((res)=>{
                if (res.data.id != undefined) {
                    navigate(`/edit/${res.data.id}`)
                } else {
                    setError("Something went wrong!");
                }
            })
        } catch(err){
            setError(err.response.data)
        }
    }

    return (
        <Container fluid className="--bg-secondary fill-screen text-start px-5 pt-5">
            <Row className="justify-content-md-center">
                <Col sm={12} lg={9}>
                    <h2>Create New Flashcard Set</h2>
                    <Row xs={1} md={2} >
                        <Col>
                        <Form.Group className="mb-4">
                            <Form.Label>Flashcard Set Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter title"
                                onChange={handleInfoChange}
                                value={info.title}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Subject</Form.Label>
                            <Form.Select aria-label="Default select example" name="subject" onChange={handleInfoChange} value={info.subject}>
                            <option value="">Choose a subject</option>
                            <option value="Sciences">Sciences</option>
                            <option value="Social Sciences">Social Sciences</option>
                            <option value="Arts and Humanities">Arts and Humanities</option>
                            <option value="Math">Math</option>
                            <option value="Language">Languages</option>
                            <option value="Others">Others</option>
                            </Form.Select>
                        </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                name="description"
                                placeholder="Enter email"
                                rows={5}
                                onChange={handleInfoChange}
                                value={info.description}
                            />
                            </Form.Group>
                        </Col>
                    </Row>
                    <p style={{color:"red"}} className="mb-4">{error}</p>
                    <Button className="px-5" onClick={submitInfo}>Create</Button>
                </Col>
            </Row>            
        </Container>
    )
}

export default Create;