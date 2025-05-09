import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost
} from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/post/:postId", getCommentsByPost);
router.delete("/:commentId", protect, deleteComment);

export default router;
