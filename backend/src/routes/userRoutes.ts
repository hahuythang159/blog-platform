import express from "express";
import { getMyProfile, updateProfile, removeFollower, unfollowUser, uploadAvatar, getUserAvatar, deleteUserAccount } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);
router.delete("/follower/:followerId", protect, removeFollower);
router.delete("/following/:followingId", protect, unfollowUser);
router.delete("/delete", protect, deleteUserAccount);
router.post("/upload-avatar", protect, uploadAvatar);
router.get("/avatar/:userId", getUserAvatar);
export default router;
