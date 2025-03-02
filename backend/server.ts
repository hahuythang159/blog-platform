import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "././src/config/db"
import authRoutes from "./src/routes/authRoutes"

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(201).json({ message: "Server is up and running successfully!"});
})

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
