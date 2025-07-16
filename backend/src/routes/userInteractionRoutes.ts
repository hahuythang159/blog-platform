import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getUserInteractions, recordInteraction } from "../controllers/userInteractionController";

const router = express.Router()

router.post('/', protect, recordInteraction)
router.get('/', protect, getUserInteractions)

export default router;