import express from "express"
import { saveCards, getCards, createCardSet, getCardSets } from "../controllers/cards.js"

const router = express.Router()

router.post("/save", saveCards)
router.get("/get/:id", getCards)
router.post("/create", createCardSet)
router.get("/getCards", getCardSets)

export default router