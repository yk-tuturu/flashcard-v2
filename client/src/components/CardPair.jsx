import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Tiptap from './TipTap';

import '../styles/App.scss';

// bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CardPair = forwardRef((props, ref) => {
    const frontRef = useRef(null);
    const backRef = useRef(null); 

    // buncha functions to get the content of, or focus the front and back
    useImperativeHandle(ref, ()=>{
        return {
            getFront() {
                const front = frontRef.current.getText();
                console.log(front);
                return front;
            },
            getBack() {
                const back = backRef.current.getText();
                return back;
            },
            focusFront() {
                frontRef.current.focus();
            },
            focusBack() {
                backRef.current.focus();
            }
        }
    }, [])

    // just a wrapper functions to call functions in the parent component
    const handleAdd = () => {
        props.functions.addCard(props.index);
    }
    
    const handleDelete = () => {
        props.functions.deleteCard(props.index);
    }

    const handleFrontChange = (content) => {
        props.functions.handleCardChange(props.index, {id:props.id, front: content, back: props.backValue})
    }

    const handleBackChange = (content) => {
        props.functions.handleCardChange(props.index, {id:props.id, front: props.frontValue, back: content})
    }

    return (
        <div className="cardpair-container mb-4">
            {props.index + 1}.
            <Row xs={1} md={2} className="g-4">
                <Col>
                    <Tiptap 
                        side="front" 
                        index={props.index} 
                        initText={props.frontValue} 
                        handleFocusChange={props.functions.handleFocusChange} 
                        handleChange={handleFrontChange} 
                        ref={frontRef}>    
                    </Tiptap>
                </Col>
                <Col>
                    <Tiptap 
                        side="back" 
                        index={props.index} 
                        initText={props.backValue} 
                        handleFocusChange={props.functions.handleFocusChange} 
                        handleChange={handleBackChange} 
                        ref={backRef}>
                    </Tiptap>
                </Col>
            </Row>
                
            <div className="cardpair-buttons d-flex flex-column">
                <button onClick={handleAdd}><img src="/add.png" alt="add"></img></button>
                <button onClick={handleDelete}><img src="/delete.png" alt="delete"></img></button>
                <button {...props.listeners} {...props.attributes}><img src="/drag.png" alt="drag"></img></button>
            </div>
            
        </div>
    )
})

export default CardPair;