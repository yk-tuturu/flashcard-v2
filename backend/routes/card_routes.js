import express from "express"
import { saveCards, getCards, createCardSet } from "../controllers/cards.js"

const router = express.Router()

router.post("/save", saveCards)
router.get("/get/:id", getCards)
router.post("/create", createCardSet)

export default router