import {useState, useContext, useEffect, useCallback, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import CardPair from "../components/CardPair"
import { AuthContext } from '../context/authContext';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ShortUniqueId from "short-unique-id";
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Edit = () => {
    const uid = new ShortUniqueId({ length: 7 });

    const {currentUser} = useContext(AuthContext);

    const id = 14;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(`http://localhost:8800/cards/get/${id}`)
            
            // if you're not the author, kicks you back to homepage
            // yeah prolly not the best way to implement this, can change this later
            if (res.data[0].user_id !== currentUser.id) {
              navigate("/")
            }
            
            // parses flashcard content, which was originally stored as a JSON string in the database
            const newCards = JSON.parse(res.data[0].flashcards)
            console.log(newCards)
            console.log(res.data[0].description)

            for (let card of newCards) {
                card.key = uid.rnd();
            }
            
            setInfo({
              title: res.data[0].title,
              subject: res.data[0].subject,
              description: res.data[0].description,
            })

            setCards(newCards);
          }
          catch(err) {
            console.log(err)
          }
        };
        fetchData()
      }, [id])

    const [info, setInfo] = useState({
        title: "",
        subject: "",
        description: ""
      });
    
    // the actual content of the cards state will only be updated per save, so it'll be mildly out of sync, but the indexes will be accurate
    const [cards, setCards] = useState([]);
    const cardsRef = useRef(null);

    function getMap() {
        if (!cardsRef.current) {
        cardsRef.current = new Map();
        }
        return cardsRef.current
    }

    const handleInfoChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
        console.log(info);
    }

    // const saveCardInfo = () => {
    //     const map = getMap();
    //     const newCards = [];
        
    //     for (const card of cards) {
    //         let node = map.get(card.key);
    //         const front = node.getFront();
    //         const back = node.getBack();

    //         newCards.push({key:card.key, front:front, back:back});
    //     }

    //     setCards(newCards);
    //     console.log(newCards);
    // }

    const saveCardInfo = async(e) => {
        e.preventDefault();

        const map = getMap();
        const saveData = [];
        const newCards = []
        console.log(map);
        for (const card of cards) {
            let node = map.get(card.key);
            const front = node.getFront();
            const back = node.getBack();

            saveData.push({front:front, back:back});
            newCards.push({key: card.key, front: front, back: back});
        }

        setCards(newCards);

        const data = {
            id: id,
            title: info.title,
            subject: info.subject,
            description: info.description,
            cards: JSON.stringify(saveData),
            length: newCards.length
        }
        try {
          await axios.post("http://localhost:8800/cards/save", data).then(function(response){
            console.log("save success!")
          })
        } catch(err) {
          console.log(err);
        }
      }

    const functions = {
        
    }

    
    
    return (
        <Container fluid className="--bg-secondary fill-screen text-start px-5 pt-5 d-flex justify-content-center">
            <Col xs={12} md={12} lg={9}>
                <h2>Edit Flashcard Details</h2>
                <Row xs={1} md={2}>
                    <Col>
                    <Form.Group className="mb-4">
                        <Form.Label>Flashcard Set Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Enter title"
                            onChange={handleInfoChange}
                            value={info.title}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Select Subject</Form.Label>
                        <Form.Select aria-label="Default select example" name="subject" onChange={handleInfoChange} value={info.subject}>
                        <option value="">Choose a subject</option>
                        <option value="Sciences">Sciences</option>
                        <option value="Social Sciences">Social Sciences</option>
                        <option value="Arts and Humanities">Arts and Humanities</option>
                        <option value="Math">Math</option>
                        <option value="Language">Languages</option>
                        <option value="Others">Others</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-4">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            name="description"
                            placeholder="Enter email"
                            rows={5}
                            onChange={handleInfoChange}
                            value={info.description}
                        />
                    </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between mb-2">
                    <div><h2>Edit Flashcards</h2></div>
                    <div><Button onClick={saveCardInfo}>Save</Button></div>
                </div>
                {cards.map(function(card, index) {
                    return(
                    <CardPair key={card.key} index={index} frontValue={card.front} backValue={card.back} functions={functions} ref={(node) => {
                        const map = getMap();
                        if (node) {
                        map.set(card.key, node);
                        } else {
                        map.delete(card)
                        }
                    }}></CardPair>
                    )
                })}
            </Col>
           
        </Container>
    )
}

export default Edit;