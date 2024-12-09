import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

// bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Tiptap from './TipTap';


const CardPair = forwardRef((props, ref) => {
    // const [frontValue, setFrontValue] = useState(props.frontValue);
    // const [backValue, setBackValue] = useState(props.backValue);

    // useEffect(() => {
    //     console.log(props.frontValue);
    //     console.log(props.backValue);
    //   }, []);

    const frontRef = useRef(null);
    const backRef = useRef(null); 

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
            }
        }
    }, [])

    const saveText = (side, text) => {
        //props.functions.handleCardChange(props.index, side, text);
    }
    return (
        <div className="cardpair-container mb-4">
            {props.index + 1}.
            <Row xs={1} md={2} className="g-4">
                <Col>
                    <Tiptap side="front" initText={props.frontValue} ref={frontRef} ></Tiptap>
                </Col>
                <Col>
                    <Tiptap side="back" initText={props.backValue} ref={backRef}></Tiptap>
                </Col>
            </Row>
                
            
            <button>Add</button>
        </div>
    )
})

export default CardPair;