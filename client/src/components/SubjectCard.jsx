import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import "../browse.scss";
import { useNavigate } from 'react-router-dom';

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

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