import express from "express"
import { saveCards, getCards } from "../controllers/cards.js"

const router = express.Router()

router.post("/save", saveCards)
router.get("/get/:id", getCards)

export default router