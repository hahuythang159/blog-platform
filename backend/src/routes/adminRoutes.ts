import express from "express";
import { isAdmin } from "../middlewares/isAdmin";
import { getAllUsers, toggleBanUser } from "../controllers/admin/userAdmin";
import { getSystemStats, getTopPosts } from "../controllers/admin/statsAdmin";
import { protect } from "../middlewares/authMiddleware";
import { getPosts } from "../controllers/postController";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/users", getAllUsers);
router.get("/stats", getSystemStats);
router.get("/stats/top-posts", getTopPosts);
router.get("/posts", getPosts);
router.patch("/users/:userId/ban", protect, isAdmin, toggleBanUser);

export default router;
