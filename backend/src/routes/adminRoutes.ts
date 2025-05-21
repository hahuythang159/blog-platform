import express from "express";
import { isAdmin } from "../middlewares/isAdmin";
import { getAllUsers } from "../controllers/admin/userAdmin";
import { getSystemStats, getTopPosts } from "../controllers/admin/statsAdmin";
import { protect } from "../middlewares/authMiddleware";
import { getPost } from "../controllers/postController";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/users", getAllUsers);
router.get("/stats", getSystemStats);
router.get("/stats/top-posts", getTopPosts);
router.get("/posts", getPost);

export default router;
