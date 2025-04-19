import express from "express";
import { toggleFollow } from "../controllers/followController";

const router = express.Router();

router.post("/:username", toggleFollow);

export default router;
