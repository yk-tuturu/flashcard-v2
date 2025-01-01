import {useState, useEffect, useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import "../View.scss";
import {useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import ShortUniqueId from "short-unique-id";
import parse from "html-react-parser"

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CardViewer = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);

    function move(direction) {
        const target = currentIndex + direction;
        if (target < 0 || target > props.cards.length - 1) {
            return;
        }

        // Update current index
        setCurrentIndex(idx => target)
      
        // Calculate offset
        const offset = -(target) * 100; // 100% for each slide width
      
        // Apply transform to move slides
        if (scrollRef.current) {
            scrollRef.current.style.transform = `translateX(${offset}%)`;
        } 
    }
    return (
        <div>
            <div className="view-window">
                <div className="carousel-container">
                    <div className="carousel" ref={scrollRef}>
                        {props.cards.map((card, index) => {
                            return (
                                <div key={index} className="flashcard">
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <div>{parse(card.front)}</div>
                                        </div>
                                        <div className="flip-card-back">
                                            <div>{parse(card.back)}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <button onClick={()=> move(-1)}>Left</button>
            <button onClick={()=> move(1)}>Right</button>
        </div>
        
    )
}

export default CardViewer;