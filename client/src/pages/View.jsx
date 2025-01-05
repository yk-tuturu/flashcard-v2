import {useState, useEffect, useContext} from "react";
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";
import ShortUniqueId from "short-unique-id";

import '../styles/App.scss';
import "../styles/browse.scss";
import "../styles/View.scss";
import {shuffleArray, formatDate} from "../util.js"
import {AuthContext} from "../context/authContext.js";
import CardViewer from "../components/CardViewer";

// bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const View = () => {
    const [info, setInfo] = useState({
        title: "",
        subject: "",
        description: "",
        author: "",
        likes: 0,
        bookmarks: 0,
        is_liked: false,
        is_bookmarked: false,
        date_created: ""
    });
    const [cards, setCards] = useState([]);
    const [ogCards, setOgCards] = useState([]); // copy of cards in their original arrangement, used to reset shuffle
    const [shuffle, setShuffle] = useState(false);

    const location = useLocation()
    const flashSetId = location.pathname.split("/")[2]

    const {currentUser} = useContext(AuthContext);

    // makes sure the page is always refreshed when the user backs or forwards into the page
    useEffect(()=> {
        function refresh( event ) {
            var perfEntries = performance.getEntriesByType("navigation");
            var historyTraversal = event.persisted || 
                                   ( typeof window.performance != "undefined" && 
                                    perfEntries[0].type === "back_forward")
            if ( historyTraversal ) {
              // Handle page restore.
              window.location.reload();
            }
        };

        window.addEventListener("pageshow", refresh, false);
    
        return () => {
          window.removeEventListener("pageshow", refresh, false);
        };
    }, [])

    useEffect(()=> {
        const uid = new ShortUniqueId({ length: 7 });

        const fetchData = async() => {
            try {
                const res = await axios.get(`http://localhost:8800/cards/get?id=${flashSetId}&user=${currentUser.id}`)
                
                // parses flashcard content, which was originally stored as a JSON string in the database
                const newCards = JSON.parse(res.data[0].flashcards)
                
                // sets a random id for each card 
                for (let card of newCards) {
                  card.id = uid.rnd();
                }
                
                // sets all the data
                const newInfo = {
                    title: res.data[0].title,
                    subject: res.data[0].subject,
                    description: res.data[0].description,
                    author: res.data[0].username,
                    likes: res.data[0].like_count,
                    bookmarks: res.data[0].bookmark_count,
                    is_liked: res.data[0].is_liked === 1 ? true : false,
                    is_bookmarked: res.data[0].is_bookmarked === 1 ? true : false,
                    date_created: formatDate(res.data[0].date_created)
                  }
                setInfo(newInfo)
                setCards(newCards);
                setOgCards(newCards);
              }
            catch(err) {
                console.log(err)
            }
        }
        fetchData();
    }, [flashSetId, currentUser.id])

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

    function toggleLike() {
        const postData = async() => {
            const data = {
                user_id: currentUser.id,
                flashset_id: flashSetId
            }

            try {
                if (info.is_liked) {
                    await axios.post("http://localhost:8800/likes/removeLike", data).then(function(response){
                        setInfo((prev) => ({...prev, is_liked: false, likes: prev.likes - 1}));
                    })
                } else {
                    await axios.post("http://localhost:8800/likes/addLike", data).then(function(response){
                        setInfo((prev) => ({...prev, is_liked: true, likes: prev.likes + 1}));
                    })
                }
                
            } catch (err) {
                console.log(err)
            }
        }
        postData();
    }

    function toggleBookmark() {
        const postData = async() => {
            const data = {
                user_id: currentUser.id,
                flashset_id: flashSetId
            }

            try {
                if (info.is_bookmarked) {
                    await axios.post("http://localhost:8800/likes/removeBookmark", data).then(function(response){
                        setInfo((prev) => ({...prev, is_bookmarked: false, bookmarks: prev.bookmarks - 1}));
                    })
                } else {
                    await axios.post("http://localhost:8800/likes/addBookmark", data).then(function(response){
                        setInfo((prev) => ({...prev, is_bookmarked: true, bookmarks: prev.bookmarks + 1}));
                    })
                }
                
            } catch (err) {
                console.log(err)
            }
        }
        postData();
    }

    return (
        <Container fluid className="--bg-secondary fill-screen p-4 disable-horizontal-scroll">
            <Row className="d-flex justify-content-center">
                <Col md={12} lg={8} className="view-header --bg-primary p-3 mt-3 text-start" >
                      <h1>{info.title}</h1>
                      <p>Subject: {info.subject}</p>
                      <div className="d-flex justify-content-between">
                        <span>By: {info.author}  |  Date: {info.date_created}</span>
                        <span className="d-flex flex-row">
                            <span className="d-flex flex-row me-2">
                                <button className="likes-button" onClick={toggleLike}>
                                    <img src={info.is_liked ? "/heart-black.png" : "/heart.png"} alt="likes"></img>
                                </button> 
                                <p> {info.likes}</p>
                            </span>
                            <span className="d-flex flex-row">
                                <button className="likes-button" onClick={toggleBookmark}>
                                    <img src={info.is_bookmarked ? "/bookmark-black.png" : "/bookmark.png"} alt="bookmarks"></img>
                                </button> 
                                <p>{info.bookmarks}</p>
                            </span>
                        </span>
                      </div>
                      
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