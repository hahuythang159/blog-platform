import express from "express";
import { getStats, incrementView, toggleLike } from "../controllers/postStatsController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:postId", getStats);
router.post("/:postId/like", protect, toggleLike);
router.post("/:postId/view", incrementView);

export default router;
