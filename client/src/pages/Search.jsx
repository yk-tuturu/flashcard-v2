import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

import '../styles/App.scss';
import "../styles/browse.scss";
import Flashset from "../components/Flashset"
import { AuthContext } from "../context/authContext";
import { formatDate } from "../util.js"

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Search = () => {
    const subjects = ["Sciences", "Social Sciences", "Arts and Humanities", "Math", "Languages", "Other"];
    const sortTypes = ["Relevance", "Popular", "Recent"];

    const [flashsets, setFlashSets] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]); // empty array means user is filtering for all subjects
    const [selectedSort, setSelectedSort] = useState("Relevance");
    const [searchValue, setSearchValue] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const { currentUser } = useContext(AuthContext)

    const queryParams = new URLSearchParams(location.search);
    const subject = queryParams.get("subject")
    const q = queryParams.get("q")
    const sort = queryParams.get("sort");

    // makes sure the page is always refreshed when the user backs or forwards into the page
    useEffect(() => {
        function refresh(event) {
            var perfEntries = performance.getEntriesByType("navigation");
            var historyTraversal = event.persisted ||
                (typeof window.performance != "undefined" &&
                    perfEntries[0].type === "back_forward")
            if (historyTraversal) {
                // Handle page restore.
                window.location.reload();
            }
        };

        window.addEventListener("pageshow", refresh, false);

        return () => {
            window.removeEventListener("pageshow", refresh, false);
        };
    }, [])

    // fetches data based on query params provided 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = new URL("http://localhost:8800/cards/getCards");

                // adds params to the url that will be sent to backend, and updates page state to reflect the query
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

                url.searchParams.append("user_id", currentUser.id) // used to check if the user has liked a given flashset

                const res = await axios.get(url)

                // stores data obtained from server
                const newArray = [];
                for (let i = 0; i < res.data.length; i++) {
                    newArray.push({
                        id: res.data[i].id,
                        title: res.data[i].title,
                        subject: res.data[i].subject,
                        user: res.data[i].user_id,
                        author: res.data[i].username,
                        likes: res.data[i].like_count,
                        bookmarks: res.data[i].bookmark_count,
                        is_liked: res.data[i].is_liked === 1 ? true : false,
                        is_bookmarked: res.data[i].is_bookmarked === 1 ? true : false,
                        length: res.data[i].length,
                        date: formatDate(res.data[i].date_created)
                    })
                }
                setFlashSets(newArray);
            }
            catch (err) {
                console.log(err)
            }
        };
        fetchData()
    }, [q, subject, sort, currentUser.id])

    // toggle for subject filters
    const updateSubject = (e) => {
        const { name, checked } = e.target;
        if (name === "All" && checked) {
            setSelectedSubjects([]); // if selected subjects is empty, assume user is filtering for all subjects
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

    // toggles sorting criteria
    const updateSort = (e) => {
        setSelectedSort(e.target.name)
    }

    // util function to create a searchparams object
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

    // when the filter button is clicked, generate search params based on current state of page and refresh
    const onFilter = (e) => {
        e.preventDefault();

        const searchParams = createSearchParams()

        navigate({
            path: location.pathname,
            search: searchParams.toString()
        });
    }

    // when user presses enter while focused on the search bar
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(e); // redirects to search button clicked function
        }
    };

    // search button clicked, create search params and refresh the page
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
                                        checked={selectedSubjects.length === 0}
                                        onChange={updateSubject}
                                    />
                                    {subjects.map((subject, index) => {
                                        return (
                                            <Form.Check
                                                key={index}
                                                label={subject}
                                                name={subject}
                                                className="mb-2"
                                                checked={selectedSubjects.includes(subject)}
                                                onChange={updateSubject}
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
                                                key={index}
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
                            {flashsets.map((flashset, index) => {
                                return <Flashset
                                    key={flashset.id}
                                    id={flashset.id}
                                    title={flashset.title}
                                    author={flashset.author}
                                    subject={flashset.subject}
                                    likes={flashset.likes}
                                    bookmarks={flashset.bookmarks}
                                    is_liked={flashset.is_liked}
                                    is_bookmarked={flashset.is_bookmarked}
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