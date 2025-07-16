import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";
import UserInteraction from "../models/UserInteraction";
import User from "../models/User";
import { INTERACTION_COOLDOWN, InteractionType, VALID_TYPES } from "../constants/interaction";

/**
 * @function recordInteraction
 * @description Records a user interaction with a post. Supported types include: `view`, `like`, and `comment`.
 * 
 * - `view`: Can be recorded repeatedly but only once within a cooldown window (e.g., 60 seconds) to prevent spamming.
 * - `like` and `comment`: Only one interaction per user per post is allowed (no duplicates).
 * 
 * Validates user, post ID, and interaction type before recording. Uses cooldown logic and deduplication checks.
 * 
 * @route POST /api/user-interactions
 * @access Authenticated users only
 * 
 * @param {Request} req - Express request object (must contain `user`, `postId`, and `type` in body)
 * @param {Response} res - Express response object
 * 
 * @returns {201} Interaction recorded successfully
 * @returns {200} Already recorded recently (for view) or interaction already exists (like/comment)
 * @returns {400} Invalid post ID or interaction type
 * @returns {404} User or post not found
 * @returns {500} Server error
 */
export const recordInteraction = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?._id;
        const { postId, type } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid user or postId" });
        }

        if (!VALID_TYPES.includes(type)) {
            return res.status(400).json({ message: "Invalid interaction type" });
        }

        const interactionType = type as InteractionType;

        // Check User & Post
        const [user, post] = await Promise.all([
            User.findById(userId),
            Post.findById(postId).select('tags')
        ]);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check cooldown for view
        const cooldown = INTERACTION_COOLDOWN[interactionType];
        if (cooldown > 0) {
            const recent = await UserInteraction.findOne({
                user: userId,
                post: postId,
                type: interactionType,
                createdAt: { $gte: new Date(Date.now() - cooldown * 1000) }
            });

            if (recent) {
                return res.status(200).json({ message: `Already recorded recently (${interactionType})` });
            }
        }

        // Like/comment can only be recorded once
        if (interactionType === 'like' || interactionType === 'comment') {
            const existing = await UserInteraction.findOne({
                user: userId,
                post: postId,
                type: interactionType
            });

            if (existing) {
                return res.status(200).json({ message: `${interactionType} already exists` });
            }
        }

        // New interactive recording
        const interaction = new UserInteraction({
            user: userId,
            post: postId,
            tags: post?.tags,
            type: interactionType
        });

        await interaction.save();

        return res.status(201).json({ message: 'Interaction recorded successfully' });

    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * @function getUserInteractions
 * @description Retrieves all interactions made by the currently authenticated user, including the associated post title and tags.
 * 
 * Sorted by most recent interaction. Useful for analytics, personalization, or user history.
 * 
 * @route GET /api/user-interactions
 * @access Authenticated users only
 * 
 * @param {Request} req - Express request object (must contain authenticated `user`)
 * @param {Response} res - Express response object
 * 
 * @returns {200} List of user interactions (with populated post and tag info)
 * @returns {404} User not found
 * @returns {500} Failed to fetch interactions
 */
export const getUserInteractions = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user._id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User does not exist" });
            return;
        }

        const interactions = await UserInteraction.find({ user: userId })
            .populate('post', 'title')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .lean()

        return res.json(interactions)
    } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Failed to fetch interactions' })
    }
}