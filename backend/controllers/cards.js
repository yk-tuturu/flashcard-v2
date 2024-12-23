import {db} from "../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const saveCards = (req, res) => {
    const newCards = req.body.cards
    
    const q = "UPDATE flashsets SET title=?, subject=?, description=?, flashcards = ?, length=? WHERE id=?"
    const values = [
        req.body.title,
        req.body.subject,
        req.body.description,
        newCards,
        req.body.length, 
        req.body.id
    ]
    db.query(q, values, (err, data) => {
        if (err) return res.status(502).json(err)

        return res.status(200).json("update success")
    })
}

export const getCards = (req, res) => {
    const id = req.params.id; 

    const q = "SELECT ?? FROM flashsets f INNER JOIN users u ON u.id = f.user_id WHERE f.id = ?"

    const columns = [
        "f.id",
        "f.user_id",
        "title",
        "subject",
        "length",
        "likes",
        "bookmarks",
        "username",
        "flashcards",
        "description"
    ]

    db.query(q, [columns, req.params.id], (err, data) => {
        if (err) return res.status(502).json(err)
        
        return res.status(200).json(data)
    })
}

export const createCardSet = (req, res) => {
    if (!req.body.title) {
        return res.status(404).json("Title must not be null")
    }

    if (!req.body.subject) {
        return res.status(404).json("Subject must not be null")
    }

    const emptyCard = [{
        front: "",
        back: ""
    }]

    const q = "INSERT INTO flashsets(`title`, `user_id`, `flashcards`, `subject`, `description`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.user_id,
        JSON.stringify(emptyCard),
        req.body.subject,
        req.body.description
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        return res.status(200).json({id: data.insertId})
    })
}