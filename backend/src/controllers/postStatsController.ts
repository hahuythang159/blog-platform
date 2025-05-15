import { Response } from "express";
import { AuthRequest } from "../types/customRequest";
import PostStats from "../models/PostStats";
import { getAuthUserId } from "../utils/getAuthUserId";
import { Types } from "mongoose";
import mongoose from "mongoose";
import Post from "../models/Post";

/**
 * GET /api/post-stats/:postId
 * Get stats (likes and views) for a specific post
 * - If no likes or views yet: show appropriate messages
 */
export const getStats = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const postId = req.params.postId;

        // Try to find stats for this post
        let stats = await PostStats.findOne({ post: postId }).populate("likes", "username");

        // If no stats exist, create an empty one (0 views, no likes)
        if (!stats) {
            stats = await PostStats.create({
                post: postId,
                views: 0,
                likes: []
            });
        }

        const response: any = {
            post: stats.post,
            views: stats.views,
            likes: stats.likes,
        };

        if (stats.views === 0) {
            response.viewsMessage = "This post has no views yet.";
        }

        if (!stats.likes || stats.likes.length === 0) {
            response.likesMessage = "This post has no likes yet.";
        }

        return res.json(response);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

/**
 * POST /api/post-stats/:postId/like
 * Toggle like/unlike for the authenticated user on a post
 */
export const toggleLike = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = new Types.ObjectId(getAuthUserId(req));
        const postId = req.params.postId;

        let stats = await PostStats.findOne({ post: postId });
        if (!stats) {
            stats = await PostStats.create({ post: postId, likes: [userId] });
            return res.json(stats);
        }

        const alreadyLiked = stats.likes.some(id => id.equals(userId));
        if (alreadyLiked) {
            stats.likes = stats.likes.filter(id => !id.equals(userId));
        } else {
            stats.likes.push(userId);
        }

        await stats.save();
        return res.json(stats);
    } catch (err) {
        return res.status(500).json({ message: "Error toggling like", error: err });
    }
};

/**
 * POST /api/post-stats/:postId/view
 * Increment view count for a post (anonymous or auth)
 */
export const incrementView = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const postId = req.params.postId;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid postId" });
        }

        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }

        const stats = await PostStats.findOneAndUpdate(
            { post: postId },
            { $inc: { views: 1 } },
            { new: true, upsert: true }
        );

        return res.json(stats);
    } catch (err: any) {
        return res.status(500).json({ message: "Error incrementing views", error: err?.message });
    }
};
