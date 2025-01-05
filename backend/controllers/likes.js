import {db} from "../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const addLike = (req, res) => {
    if (!req.body.user_id) {
        return res.status(404).json("bad request")
    }

    if (!req.body.flashset_id) {
        return res.status(404).json("bad request")
    }

    const q = `INSERT INTO likes (user_id, flashset_id) 
                    SELECT ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1 FROM likes WHERE user_id = ? AND flashset_id = ?
                    )`
    const values = [
        req.body.user_id,
        req.body.flashset_id,
        req.body.user_id,
        req.body.flashset_id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.status(404).json(err);
        return res.status(200).json("like recorded")
    })
}

export const addBookmark = (req, res) => {
    if (!req.body.user_id) {
        return res.status(404).json("bad request")
    }

    if (!req.body.flashset_id) {
        return res.status(404).json("bad request")
    }

    const q = `INSERT INTO bookmarks (user_id, flashset_id) 
                    SELECT ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1 FROM bookmarks WHERE user_id = ? AND flashset_id = ?
                    )`
    const values = [
        req.body.user_id,
        req.body.flashset_id,
        req.body.user_id,
        req.body.flashset_id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.status(404).json(err);
        return res.status(200).json("bookmark recorded")
    })
}

export const removeLike = (req, res) => {
    if (!req.body.user_id) {
        return res.status(404).json("bad request")
    }

    if (!req.body.flashset_id) {
        return res.status(404).json("bad request")
    }

    const q = "DELETE FROM likes WHERE user_id=? AND flashset_id=?"
    const values = [
        req.body.user_id,
        req.body.flashset_id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.status(404).json(err);
        return res.status(200).json("like removed")
    })
}

export const removeBookmark = (req, res) => {
    if (!req.body.user_id) {
        return res.status(404).json("bad request")
    }

    if (!req.body.flashset_id) {
        return res.status(404).json("bad request")
    }

    const q = "DELETE FROM bookmarks WHERE user_id=? AND flashset_id=?"
    const values = [
        req.body.user_id,
        req.body.flashset_id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.status(404).json(err);
        return res.status(200).json("bookmark removed")
    })
}