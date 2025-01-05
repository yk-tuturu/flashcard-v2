import {useState, useEffect, useRef, useCallback} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "../styles/View.scss";

import parse from "html-react-parser"

import Slider from "../components/Slider";

const CardViewer = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSide, setCurrentSide] = useState("front");

    const scrollRef = useRef(null);
    const cardsRef = useRef(new Map());
    const sliderRef = useRef(null);

    // get function for the cardsref
    function getMap() {
        if (!cardsRef.current) {
            cardsRef.current = new Map();
        }
        return cardsRef.current
    }

    const move = useCallback((direction) => {
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
    }, [currentIndex, currentSide, props.cards])

    const flip = useCallback(() => {
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
    }, [props.cards, currentIndex, currentSide])

    // when the slider position is changed by user, update the cards position
    // this function will be passed to the slider component so it can be called from there
    function onSlideUpdate(target) {
        // we want integers
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

    // given an inner and outer container, resize the text in inner container until it fits
    const resize_to_fit = useCallback((inner, outer) => {
        let fontSize = window.getComputedStyle(inner).fontSize;

        // exit when min font size reached
        if (parseFloat(fontSize) < 6) {
            return;
        }

        // recursive call (the ONE time recursion is actually useful)
        if(inner.clientHeight >= outer.clientHeight){
            inner.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
            resize_to_fit(inner, outer);
        }
    }, [])

    // gets the relevant divs for the cards and calls resize to fit
    const resize_cards = useCallback(() => {
        const map = getMap()

        for (let [card, node] of map) {
            for (const child of node.children) {
                for (const grandchild of child.children) {
                    grandchild.style.fontSize = "2rem";
                    resize_to_fit(grandchild, child);
                }
            }
        }
    }, [resize_to_fit])

    // on page load, call resize
    useEffect(()=> {
        resize_cards();
    }, [resize_cards])

    // and also call it when the page is resized
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