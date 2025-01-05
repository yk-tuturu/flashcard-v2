import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/App.scss';
import "../styles/browse.scss";

// bootstrap
import Card from 'react-bootstrap/Card';

const SubjectCard = (props) => {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();

        const searchParams = new URLSearchParams();
        searchParams.set("subject", props.title);
        searchParams.set("sort", "Recent");

        navigate({
            pathname: "/search",
            search: searchParams.toString()
        })
    }
    return (
        <Card className="subject-card" onClick={handleClick}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    This is a longer card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit
                    longer.
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default SubjectCard;