import express from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost, getFollowingPosts } from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getPosts);
router.get("/following", protect, getFollowingPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
