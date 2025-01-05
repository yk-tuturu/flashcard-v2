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

    const q = "INSERT INTO flashsets(`title`, `user_id`, `flashcards`, `subject`, `description`, `date_created`) VALUES (?, NOW())"
    const values = [
        req.body.title,
        req.body.user_id,
        JSON.stringify(emptyCard),
        req.body.subject,
        req.body.description,
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        return res.status(200).json({id: data.insertId})
    })
}

// this is quite disgusting, but i suck at backend code
export const getCardSets = (req, res) => {
    let searchTerm =  req.query.q || "";
    let subjects = req.query.subject;
    let user_id = req.query.user_id;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || "Relevance"

    if (subjects) {
        subjects = subjects.split(",");
    } else {
        subjects = []
    }

    var processedSearch = "";
    if (searchTerm.length > 5) {
        processedSearch = "+" + searchTerm 
    } else {
        processedSearch = "%" + searchTerm + "%"
    }
    
    // what the fuck is this query
    let q = `SELECT 
                flashsets.id,
                flashsets.title,
                flashsets.user_id,
                flashsets.length,
                flashsets.subject,
                flashsets.date_created, 
                MATCH(flashsets.title) AGAINST(? IN BOOLEAN MODE) AS relevance,
                CASE WHEN bookmarks.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_bookmarked,
                COALESCE(bookmark_counts.bookmark_count, 0) AS bookmark_count,
                CASE WHEN likes.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                COALESCE(like_counts.like_count, 0) AS like_count
            FROM 
                flashsets
            LEFT JOIN
                bookmarks ON flashsets.id = bookmarks.flashset_id AND bookmarks.user_id = ?
            LEFT JOIN 
                (
                    SELECT 
                        flashset_id, 
                        COUNT(*) AS bookmark_count
                    FROM 
                        bookmarks
                    GROUP BY 
                        flashset_id
                ) AS bookmark_counts ON flashsets.id = bookmark_counts.flashset_id
            LEFT JOIN
                likes ON flashsets.id = likes.flashset_id AND likes.user_id = ?
            LEFT JOIN 
                (
                    SELECT 
                        flashset_id, 
                        COUNT(*) AS like_count
                    FROM 
                        likes
                    GROUP BY 
                        flashset_id
                ) AS like_counts ON flashsets.id = like_counts.flashset_id    
            WHERE ${searchTerm.length > 5 ? 'MATCH(flashsets.title) AGAINST(? IN BOOLEAN MODE)' : 'flashsets.title LIKE ?'}
            ${subjects.length > 0 ? 'AND flashsets.subject IN ?' : ''} `;

    if (sort === "Relevance") {
        q += "ORDER BY relevance DESC "
    } else if (sort === "Popular") {
        q += "ORDER BY bookmark_count DESC"
    } else if (sort === "Recent") {
        q += "ORDER BY date_created DESC "
    }

    q += "LIMIT " + limit;
    const values = subjects.length > 0 
        ? [processedSearch, user_id, user_id, processedSearch, [subjects], limit] 
        : [processedSearch, user_id, user_id, processedSearch, limit];
    
    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data)
    })
}