import {db} from "../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// yes, the security on this is kind of a joke, but i'll figure out how to send verification emails later
export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ? AND email= ?"
    console.log(req.body)
    db.query(q, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.status(502).json(err)
        if (data.length === 0) return res.status(502).json("User not found!")
        
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password_hash)
        if (!isPasswordCorrect) return res.status(502).json("Incorrect username or password")

        const token = jwt.sign({id: data[0].id}, "jwtkey")
        const {password_hash, ...other} = data[0]

        return res.cookie("access-token", token, {
            httpOnly: true,
            secure:true
        }).status(200).json(other)
    })
}
export const register = (req, res) => {
    console.log('reached register')
    console.log(req.body.username);
    if (!req.body.username || req.body.username.length <= 0) {
        return res.status(502).json("Username cannot be empty")
    }

    if (!req.body.email || req.body.email.length <= 0 || !req.body.email.includes("@")) {
        return res.status(502).json("Email provided must be valid");
    }

    if (!req.body.password || req.body.password.length < 8) {
        return res.status(502).json("Password must be at least 8 characters long")
    }
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length) return res.status(409).json("User already exists")

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        const q = "INSERT INTO users(`username`, `password_hash`, `email`, `date`) VALUES (?)"
        

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        const values = [
            req.body.username,
            hash,
            req.body.email,
            today
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("User has been created")
        })
    })
}

export const logout = (req, res) => {
    console.log("reached backend")
    res.clearCookie("access-token", {
        sameSite: "none",
        secure:true
    }).status(200).json("User has been logged out")
}