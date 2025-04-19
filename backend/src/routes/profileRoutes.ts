import express from "express";
import { getPublicProfile, getUserPostsByUsername, checkIsFollowing} from "../controllers/profileController";

const router = express.Router();

router.get("/:username", getPublicProfile);
router.get("/:username/posts", getUserPostsByUsername);
router.get("/:username/is-following", checkIsFollowing);

export default router;
