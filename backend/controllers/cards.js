import {db} from "../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const saveCards = (req, res) => {
    const newCards = req.body.cards

    console.log(newCards)
    
    const q = "UPDATE flashsets SET title=?, subject=?, description=?, flashcards = ?, length=? WHERE id=?"
    const values = [
        req.body.title,
        req.body.subject,
        req.body.description,
        newCards,
        newCards.length, 
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