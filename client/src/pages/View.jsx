import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import "../View.scss";
import {useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import ShortUniqueId from "short-unique-id";
import parse from "html-react-parser"
import {shuffleArray} from "../util.js"

import CardViewer from "../components/CardViewer";

// bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const View = () => {
    const [info, setInfo] = useState({
        title: "",
        subject: "",
        description: "",
        likes: 0,
        bookmarks: 0
    });
    const [cards, setCards] = useState([]);
    const [ogCards, setOgCards] = useState([]);
    const [shuffle, setShuffle] = useState(false);

    const location = useLocation()
    const flashSetId = location.pathname.split("/")[2]
    const uid = new ShortUniqueId({ length: 7 });

    useEffect(()=> {
        const fetchData = async() => {
            try {
                const res = await axios.get(`http://localhost:8800/cards/get/${flashSetId}`)
                
                // parses flashcard content, which was originally stored as a JSON string in the database
                const newCards = JSON.parse(res.data[0].flashcards)
                console.log(newCards)
                // sets a random id for each card 
                for (let card of newCards) {
                  card.id = uid.rnd();
                }
                
                // sets all the data
                setInfo({
                  title: res.data[0].title,
                  subject: res.data[0].subject,
                  description: res.data[0].description,
                  likes: res.data[0].likes,
                  bookmarks: res.data[0].bookmarks
                })
                setCards(newCards);
                setOgCards(newCards);
              }
            catch(err) {
                console.log(err)
            }
        }
        fetchData();
    }, [flashSetId])

    function toggleShuffle() {
        if (shuffle) {
            setCards(ogCards);
        } else {
            const oldCards = cards.slice()
            const shuffledCards = shuffleArray(oldCards)
            setCards(shuffledCards);
        }

        setShuffle(!shuffle);
    }

    return (
        <Container fluid className="--bg-secondary fill-screen p-4 disable-horizontal-scroll">
            <Row className="d-flex justify-content-center">
                <Col md={12} lg={8} className="--bg-primary p-3 mt-3 text-start" >
                      <h2>{info.title}</h2>
                      <p>Subject: {info.subject}</p>
                      <span>By: tuturu-owo | Date: Sep 2020</span>
                </Col>
                
            </Row>
            <Row className="justify-content-md-center mt-4">
                <Col md={12} lg={8} className="--bg-primary p-0" >
                    <div className="tab-bar">
                        <div>
                            <button id="flash" className="tab-item-active">Flashcards</button>
                            <button id="memo" className="tab-item">Memorize</button>
                        </div>
                        <div>
                            <button 
                                className={shuffle ? "tab-item-active" : "tab-item"} 
                                onClick={toggleShuffle}>
                                    <img src={shuffle ? "/shuffle-white.png" : "/shuffle.png"} alt="shuffle"></img>
                            </button>
                        </div>
                        
                    </div>
                    <CardViewer cards={cards}></CardViewer>
                    <div className="control-tips">
                        <p>Keyboard Controls:</p>
                        <p>-  Left/Right to move</p>
                        <p>-  Up/Down/Space to flip</p>
                    </div>
                </Col>
                
            </Row>
        </Container>
    )
}

export default View;