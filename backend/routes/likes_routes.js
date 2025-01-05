import express from "express"
import { addLike, addBookmark, removeLike, removeBookmark} from "../controllers/likes.js"

const router = express.Router()

router.post("/addLike", addLike)
router.post("/addBookmark", addBookmark)
router.post("/removeLike", removeLike)
router.post("/removeBookmark", removeBookmark)

export default router