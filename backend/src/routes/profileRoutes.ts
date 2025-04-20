import express from "express";
import { getPublicProfile, getUserPostsByUsername, checkIsFollowing, getFollowers, getFollowing } from "../controllers/profileController";

const router = express.Router();

router.get("/:username", getPublicProfile);
router.get("/:username/posts", getUserPostsByUsername);
router.get("/:username/is-following", checkIsFollowing);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

export default router;
