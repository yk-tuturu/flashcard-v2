import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import "../browse.scss";
import Flashset from "../components/Flashset"
import {useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const Search = () => {
    const subjects = ["Sciences", "Social Sciences", "Arts and Humanities", "Math", "Languages", "Other"];
    const sortTypes = ["Relevance", "Popular", "Recent"];

    const [flashsets, setFlashSets] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedSort, setSelectedSort] = useState("Relevance");
    const [searchValue, setSearchValue] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const subject = queryParams.get("subject")
    const q = queryParams.get("q")
    const sort = queryParams.get("sort");

    useEffect(()=> {
        const fetchData = async () => {
            try {
                const url = new URL("http://localhost:8800/cards/getCards");
                if (subject) {
                    url.searchParams.append("subject", subject);
                    setSelectedSubjects(subject.split(","));
                }
                if (q) {
                    url.searchParams.append("q", q);
                    setSearchValue(q);
                }
                if (sort) {
                    url.searchParams.append("sort", sort)
                    setSelectedSort(sort);
                }
                
                const res = await axios.get(url)
                const newArray = [];

                for (let i = 0; i < res.data.length; i++) {
                    newArray.push({
                        id: res.data[i].id,
                        title: res.data[i].title,
                        subject: res.data[i].subject,
                        user: res.data[i].user_id,
                        likes: res.data[i].likes,
                        bookmarks: res.data[i].bookmarks,
                        length: res.data[i].length,
                        date: res.data[i].date_created
                    })
                }
                console.log(newArray);
                setFlashSets(newArray);
            }
            catch(err) {
                console.log(err)
            }
        };
        fetchData()
    }, [q, subject, sort])

    const updateSubject = (e) => {
        const { name, checked } = e.target;
        if (name === "All" && checked) {
            setSelectedSubjects([]);
            return;
        }
        if (checked) {
            const newArray = [...selectedSubjects, name];
            setSelectedSubjects(newArray);
        } else {
            const newArray = selectedSubjects.filter(val => val !== name);
            setSelectedSubjects(newArray)
        }
    }

    const updateSort = (e) => {
        setSelectedSort(e.target.name)
    }

    const createSearchParams = () => {
        const searchParams = new URLSearchParams(location.search);

        if (selectedSubjects.length > 0) {
            const subjectString = selectedSubjects.join(",");
            searchParams.set("subject", subjectString);
        } else {
            searchParams.delete("subject")
        }

        searchParams.set("q", searchValue);
        searchParams.set("sort", selectedSort);

        return searchParams;
    }

    const onFilter = (e) => {
        e.preventDefault();

        const searchParams = createSearchParams()

        navigate({
            path: location.pathname,
            search: searchParams.toString()
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          onSearch(e);
        }
    };

    const onSearch = (e) => {
        e.preventDefault();

        const searchParams = createSearchParams()

        navigate({
            path: location.pathname,
            search: searchParams.toString()
        });
    }

    return (
        <Container fluid className="--bg-secondary p-4 fill-screen">
            <Row className="w-100 justify-content-md-center">
                <Col md={12} lg={8}>
                <Row className="mt-4">
                    <Col className="text-start">
                        <h3 className="mb-3">Filter by</h3>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject</Form.Label>
                                <Form.Check 
                                    key="all"
                                    label="All"
                                    name="All"
                                    className="mb-2"
                                    checked = {selectedSubjects.length === 0}
                                    onChange = {updateSubject}
                                /> 
                                {subjects.map((subject, index) => {
                                    return(  
                                        <Form.Check 
                                            key={index}
                                            label={subject}
                                            name={subject}
                                            className="mb-2"
                                            checked = {selectedSubjects.includes(subject)}
                                            onChange = {updateSubject}
                                        /> 
                                    )
                                })}
                            </Form.Group>
                            <hr></hr>
                        </Form>
                        <Form>
                            <h3 className="mb-3">Sort By:</h3>
                            <Form.Group>
                                {sortTypes.map((sort, index) => {
                                    return (
                                        <Form.Check 
                                            type="radio" 
                                            name={sort}
                                            label={sort}
                                            checked={sort === selectedSort}
                                            onChange={updateSort}
                                            className="mb-2"
                                        />
                                    )
                                })}
                            </Form.Group>
                        </Form>
                        <Button className="w-75 mt-4" onClick={onFilter}>Filter</Button>
                    </Col>
                    <Col sm={12} md={8}>
                    <InputGroup className="mb-4">
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
                    {flashsets.map((flashset, index)=> {
                        return <Flashset
                            key={flashset.id}
                            id={flashset.id}
                            title={flashset.title}
                            subject={flashset.subject}
                            likes={flashset.likes}
                            bookmarks={flashset.bookmarks}
                            user={flashset.user}
                            length={flashset.length}
                            date={flashset.date}
                        />
                    })}    
                    </Col>
                </Row>    
                </Col>
                
            </Row>
            
            
        </Container>
    )
}

export default Search;