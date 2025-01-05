import {useState, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "../styles/browse.scss";

import axios from "axios";

import {AuthContext} from "../context/authContext";

// bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Flashset = (props) => {
    // whether the current user has liked/bookmarked the flashset
    const [liked, setLiked] = useState(props.is_liked); 
    const [bookmarked, setBookmarked] = useState(props.is_bookmarked); 

    // usestate here so that the value can be toggled when user clicks the like button
    const [likeCount, setLikeCount] = useState(props.likes); 
    const [bookmarkCount, setBookmarkCount] = useState(props.bookmarks);

    const {currentUser} = useContext(AuthContext);

    function toggleLike() {
        const postData = async() => {
            const data = {
                user_id: currentUser.id,
                flashset_id: props.id
            }

            try {
                if (liked) {
                    await axios.post("http://localhost:8800/likes/removeLike", data).then(function(response){
                        setLiked(false)
                        setLikeCount(prev => prev -1)
                    })
                } else {
                    await axios.post("http://localhost:8800/likes/addLike", data).then(function(response){
                        setLiked(true)
                        setLikeCount(prev => prev +1)
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
                flashset_id: props.id
            }
            try {
                if (bookmarked) {
                    await axios.post("http://localhost:8800/likes/removeBookmark", data).then(function(response){
                        setBookmarked(false)
                        setBookmarkCount(prev => prev -1)
                    })
                } else {
                    await axios.post("http://localhost:8800/likes/addBookmark", data).then(function(response){
                        setBookmarked(true)
                        setBookmarkCount(prev => prev +1)
                    })
                }
                
            } catch (err) {
                console.log(err)
            }
        }
        postData();
    }
    
    return (
        <div className="flashset-div p-3 mb-3">
            <Row>
                <Col>
                    <h3><a href={`/view/${props.id}`}>{props.title}</a></h3>
                    <p>Subject: {props.subject}</p>
                    <div className="mb-2"><span>Author: {props.author}</span><span>Date Added: {props.date}</span><span>Length: {props.length}</span></div>
                </Col>
                <Col md={12} lg={2} className="d-flex flex-row flex-lg-column">
                    <span className="d-flex flex-row align-items-center">
                        <button className="likes-button" onClick={toggleLike}>
                            <img src={liked ? "/heart-black.png" : "/heart.png"} alt="Likes"></img>
                        </button>
                        <p>{likeCount}</p>
                    </span>
                    <span className="d-flex flex-row align-items-center">
                        <button className="likes-button" onClick={toggleBookmark}>
                            <img src={bookmarked ? "/bookmark-black.png" : "/bookmark.png"} alt="Bookmarks"></img>
                        </button>
                        <p>{bookmarkCount}</p>
                    </span>
                </Col>
            </Row>
        </div>
    )
}

export default Flashset;