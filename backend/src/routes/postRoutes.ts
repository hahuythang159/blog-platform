import express from "express";
import { getPost, getPostById, createPost, updatePost, deletePost } from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getPost);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
