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

import Slider from "../components/Slider";

const CardViewer = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSide, setCurrentSide] = useState("front");


    const scrollRef = useRef(null);
    const cardsRef = useRef(new Map());
    const sliderRef = useRef(null);

    function getMap() {
        if (!cardsRef.current) {
            cardsRef.current = new Map();
        }
        return cardsRef.current
    }

    function move(direction) {
        const target = currentIndex + direction;
        if (target < 0 || target > props.cards.length - 1) {
            return;
        }

        // if card is flipped, unflip it first
        if (currentSide === "back") {
            const currentCard = props.cards[currentIndex];
            const map = getMap();
            const node = map.get(currentCard);
            node.style.transform = "rotateX(0deg)"
            setCurrentSide("front");
        }

        // Update current index
        setCurrentIndex(idx => target)

        // set slider value
        sliderRef.current.setValue(target);
      
        // Calculate offset
        const offset = -(target) * 100; // 100% for each slide width
      
        // Apply transform to move slides
        if (scrollRef.current) {
            scrollRef.current.style.transform = `translateX(${offset}%)`;
        }
    }

    function flip() {
        const currentCard = props.cards[currentIndex];
        const map = getMap();
        const node = map.get(currentCard);
        
        if (currentSide === "front") {
            node.style.transform = "rotateX(180deg)"
            setCurrentSide("back");
        } else {
            node.style.transform = "rotateX(0deg)"
            setCurrentSide("front");
        }
    }

    function onSlideUpdate(target) {
        if (typeof(target) === "string") {
            target = parseInt(target);
        }
        // if card is flipped, unflip it first
        if (currentSide === "back") {
            const currentCard = props.cards[currentIndex];
            const map = getMap();
            const node = map.get(currentCard);
            node.style.transform = "rotateX(0deg)"
            setCurrentSide("front");
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

    function resize_to_fit(inner, outer) {
        let fontSize = window.getComputedStyle(inner).fontSize;

        if(inner.clientHeight >= outer.clientHeight){
            inner.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
            resize_to_fit(inner, outer);
        }
    }

    function resize_cards() {
        const map = getMap()
        for (let [card, node] of map) {
            for (const child of node.children) {
                for (const grandchild of child.children) {
                    grandchild.style.fontSize = "2rem";
                    resize_to_fit(grandchild, child);
                }
            }
        }
    }

    useEffect(()=> {
        resize_cards();
    }, [resize_cards])

    window.onresize = resize_cards;
      
    // manages keyboard input
    useEffect(() => {
        const ManageInput = (e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") {
            e.preventDefault();
            flip()
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
        }
        document.addEventListener("keydown", ManageInput, false);
    
        return () => {
          document.removeEventListener("keydown", ManageInput, false);
        };
      }, [flip, move]);
    
    return (
        <div>
            <div className="view-window">
                <div className="carousel-container">
                    <button className="move-button-left" onClick={()=> move(-1)}><img src="/left-arrow.png" alt="left"></img></button>
                    <button className="move-button-right" onClick={()=> move(1)}><img src="/right-arrow.png" alt="right"></img></button>
                    <div className="carousel" ref={scrollRef}>
                        {props.cards.map((card, index) => {
                            return (
                                <div key={index} className="flashcard">
                                    <div className="flip-card-inner" onClick={flip} ref={(node) => {
                                        const map = getMap();
                                        if (node) {
                                            map.set(card, node);
                                        } else {
                                            map.delete(card);
                                    }}}>
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
                <div className="slider-container">
                    <Slider min="0" max={props.cards.length-1} ref={sliderRef} onUpdate={onSlideUpdate}></Slider>
                    <div className="progress-text">{currentIndex + 1} of {props.cards.length}</div>
                </div>
                
            </div>
        </div>
        
    )
}

export default CardViewer;