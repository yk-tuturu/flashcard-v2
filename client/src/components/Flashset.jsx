import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import "../browse.scss";
import {useNavigate} from "react-router-dom"

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const Flashset = (props) => {
    const [liked, setLiked] = useState(props.is_liked);
    const [bookmarked, setBookmarked] = useState(props.is_bookmarked);
    const date = new Date(props.date)
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    
    const navigate = useNavigate();
    
    return (
        <div className="flashset-div p-3 mb-3" onClick={()=>{navigate(`/view/${props.id}`)}}>
            <Row>
                <Col>
                    <h3>{props.title}</h3>
                    <p>Subject: {props.subject}</p>
                    <div className="mb-2"><span>Author: {props.user}</span><span>Date Added: {formattedDate}</span><span>Length: {props.length}</span></div>
                </Col>
                <Col md={12} lg={2} className="d-flex flex-row flex-lg-column">
                    <span className="d-flex flex-row">
                        <img src="heart.png" alt="Likes"></img>
                        {props.likes} 
                    </span>
                    <span className="d-flex flex-row"><img src="bookmark.png" alt="Likes"></img>{props.bookmarks}</span>
                </Col>
            </Row>
            
        </div>
    )
}

export default Flashset;