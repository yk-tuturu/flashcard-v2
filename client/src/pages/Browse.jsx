import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import SubjectCard from "../components/SubjectCard"
import {useNavigate} from "react-router-dom";

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
    const subjects = ["Sciences", "Social Sciences", "Arts and Humanities", "Math", "Languages", "Other"];
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const onSearch = (e) => {
        e.preventDefault();

        const searchParams = new URLSearchParams();
        searchParams.set("q", searchValue);
        searchParams.set("sort", "Relevance");

        navigate({
            pathname: "/search",
            search: searchParams.toString()
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(e);
        }
    }
    return (
        <Container fluid className="--bg-secondary p-4 fill-screen">
            <Row className="w-100 justify-content-md-center">
                <Col sm={12} md={8}>
                    <h1>Search for flashcards</h1>
                    <p>Find flashcards decks by keywords or subject</p>
                    <InputGroup className="mb-5">
                    <Form.Control
                        type="text"
                        placeholder="Enter search term..."
                        size="lg"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        />
                        <Button variant="outline-secondary" onClick={onSearch}>
                            Search
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="text-start w-100 justify-content-md-center">
            <Col sm={12} lg={8}>
                <h2 className="mb-4">Or browse by subject</h2>
                <Row xs={1} md={2} lg={3}  className="g-4">
                    {subjects.map((subject, index) => {
                        return (
                            <Col><SubjectCard title={subject}></SubjectCard></Col>
                        )
                    })}
                </Row>
            </Col>
            </Row>
            
            
        </Container>
    )
}

export default Browse;