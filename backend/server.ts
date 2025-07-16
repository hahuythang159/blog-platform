import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "././src/config/db"
import authRoutes from "./src/routes/authRoutes"
import postRouter from "./src/routes/postRoutes"
import profileRoutes from "./src/routes/profileRoutes";
import followRoutes from "./src/routes/followRoutes";
import userRoutes from "./src/routes/userRoutes";
import commentRoutes from "./src/routes/commentRoutes";
import postStatsRoutes from "./src/routes/postStatsRoutes";
import adminRoutes from "./src/routes/adminRoutes";
import userInteraction from "./src/routes/userInteractionRoutes";

import { createDefaultAdmin } from "./src/seeds/initAdmin";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in .env file");
}

app.get("/", (req, res) => {
    res.status(201).json({ message: "Server is up and running successfully!" });
})
app.use('/api/posts', postRouter);

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/follow", followRoutes);

app.use("/api/user", userRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/post-stats", postStatsRoutes)

app.use("/api/admin", adminRoutes);

app.use("/api/user-interactions", userInteraction)

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
    await createDefaultAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});