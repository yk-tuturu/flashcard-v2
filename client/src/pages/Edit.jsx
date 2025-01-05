import {useState, useContext, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import SortableWrapper from "../components/SortableWrapper"
import { AuthContext } from '../context/authContext';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ShortUniqueId from "short-unique-id";
import axios from "axios";
import {DndContext, closestCorners } from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy, arrayMove} from "@dnd-kit/sortable";

import {useNavigate, useLocation} from "react-router-dom"

const Edit = () => {
  const uid = new ShortUniqueId({ length: 7 });

  const {currentUser} = useContext(AuthContext);

  // to know which flashset we are supposed to fetch, we read the url
  const location = useLocation()
  const cardsetId = location.pathname.split("/")[2]

  const navigate = useNavigate();

  const [info, setInfo] = useState({
    title: "",
    subject: "",
    description: ""
  });

  // nevermind we are updating card state on every change
  const [cards, setCards] = useState([]);
  const [focusedCard, setFocusedCard] = useState({side: "front", index: -1}); // -1 means no card focused
  const [appended, setAppended] = useState(false);

  const cardsRef = useRef(null);
  
  // gets cardref map
  function getMap() {
    if (!cardsRef.current) {
    cardsRef.current = new Map();
    }
    return cardsRef.current
  }

  // to fetch card data based on id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/cards/get/${cardsetId}`)
        
        // if you're not the author, kicks you back to homepage
        // yeah prolly not the best way to implement this, can change this later
        if (res.data[0].user_id !== currentUser.id) {
          navigate("/")
        }
        
        // parses flashcard content, which was originally stored as a JSON string in the database
        const newCards = JSON.parse(res.data[0].flashcards)
        
        // sets a random id for each card 
        for (let card of newCards) {
          card.id = uid.rnd();
        }
        
        // sets all the data
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
  }, [cardsetId, currentUser])

  // handles change in the info fields -- title, description, etc
  const handleInfoChange = (e) => {
    setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  // saves cards to backend
  const saveCardInfo = async(e) => {
    e.preventDefault();

    const map = getMap();
    const cardData = [];
    for (const card of cards) {
      let node = map.get(card.id);
      const front = node.getFront();
      const back = node.getBack();

      cardData.push({front:front, back:back});
    }

    const data = {
      id: cardsetId,
      title: info.title,
      subject: info.subject,
      description: info.description,
      cards: JSON.stringify(cardData),
      length: cardData.length
    }

    try {
      await axios.post("http://localhost:8800/cards/save", data).then(function(response){
        console.log("save success!")
      })
    } catch(err) {
      console.log(err);
    }
  }
  
  // when user presses tab, automatically moves focus to next card, or if at the end of cards, create a new one
  useEffect(() => {
    const TabFunction = (event) => {
      if (event.key === "Tab") {
        const map = getMap()
        
        // -1 represents no card focused, so do nothing
        if (focusedCard.index === -1) {
          return
        }
        
        // if at front, moves focus to the back of the same card
        if (focusedCard.side === "front") {
          const card_id = cards[focusedCard.index].id;
          const node = map.get(card_id);
          node.focusBack();
        } 
        
        // if at back, moves focus to front of next card
        else if (focusedCard.side === "back") {
          // if at last card, adds a new card
          if (focusedCard.index === cards.length - 1) {
            addCard(cards.length - 1);
            setAppended(true); // boolean used to focus the new card only when its been generated
            return;
          }
          
          // else just get the next card
          const next_card_id = cards[focusedCard.index + 1].id;
          const node = map.get(next_card_id);
          node.focusFront()
        }
      }
    }
    document.addEventListener("keydown", TabFunction, false);

    return () => {
      document.removeEventListener("keydown", TabFunction, false);
    };
  }, [info, focusedCard, cards]);
  
  // if we added a card just now from the tab function, focus the new card 
  useEffect(()=> {
    if (appended) {
      const card_id = cards[cards.length - 1].id;
      const map = getMap();
      const node = map.get(card_id);
      node.focusFront();
      setAppended(false);
    }
  }, [appended, cards])
  
  // if user manually switches focus, updates state to reflect this
  function handleFocusChange(side, index) {
    setFocusedCard({side: side, index: index});
  }

  // adds new card... nothing much to say
  function addCard(index) {
    const newCards = [
      ...cards.slice(0, index + 1), 
      {id: uid.rnd(), front: "", back: ""},
      ...cards.slice(index + 1)
    ]
    setCards(newCards)
  }

  // deletes card... nothing much to say
  function deleteCard(index) {
    if (cards.length <= 1) return
    const newCards = [
      ...cards.slice(0, index),
      ...cards.slice(index + 1)
    ]
    setCards(newCards);
  }

  // handles change of card content, takes a index and a card object
  function handleCardChange(index, newCardContent) {
    const newCards = cards.map((card, i)=> {
      return i=== index 
          ? newCardContent
          : card;
    })
    setCards(newCards);
  }

  // helper function for on drag end
  function getCardIndexById(id) {
    return cards.findIndex(card=>card.id === id);
  }

  // drag end function for dnd functionality
  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id === over.id) return; // if we are still hovering over the same card pos, do nothing
    
    // moves card to new index
    setCards(cards => {
      const originalPos = getCardIndexById(active.id);
      const newPos = getCardIndexById(over.id);

      return arrayMove(cards, originalPos, newPos);
    })
  }

  // bunch of functions to be passed to the cards
  const functions = {
    handleCardChange: handleCardChange,
    handleFocusChange: handleFocusChange,
    addCard: addCard,
    deleteCard: deleteCard
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
            <option value="Languages">Languages</option>
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
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <SortableContext strategy={verticalListSortingStrategy} items={cards}>
            {cards.map(function(card, index) {
              return(
                <SortableWrapper 
                  key={card.id} 
                  id={card.id} 
                  index={index} 
                  frontValue={card.front} 
                  backValue={card.back} 
                  functions={functions} 
                  cardsRef={getMap()}>
                </SortableWrapper>
              )
            })}
          </SortableContext>
        </DndContext>
      </Col>
    </Container>
  )
}

export default Edit;