import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "././src/config/db"
import authRoutes from "./src/routes/authRoutes"
import postRouter from "./src/routes/postRoutes"

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in .env file");
}

app.get("/", (req, res) => {
    res.status(201).json({ message: "Server is up and running successfully!"});
})
app.use('/api/posts', postRouter);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
