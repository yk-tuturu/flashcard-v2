import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth_route.js"
import cardRoutes from "./routes/card_routes.js";
import cookieParser from "cookie-parser"

const app = express()

const corsOps = {
    origin: true,
    credentials: true
}

app.use(express.json())
app.use(cors(corsOps))
app.use(cookieParser())
app.use("/auth", authRoutes)
app.use("/cards", cardRoutes)

app.listen(8800, () => {
    console.log("Connected to backend!")
})