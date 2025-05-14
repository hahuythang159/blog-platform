import { Response } from "express";
import { AuthRequest } from "../types/customRequest";
import Comment from "../models/Comment";
import Post from "../models/Post";
import mongoose from "mongoose";
import { getAuthUserId } from "../utils/getAuthUserId";

/**
 * POST /api/comments
 * Create a new comment on a specific post.
 * Requires authentication.
 * 
 * Request body:
 * {
 *   postId: string,     // ID of the post to comment on
 *   content: string     // Content of the comment
 * }
 * 
 * Response:
 * 201 Created with the new comment object, or relevant error message.
 */
export const createComment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;
        const { postId, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Content cannot be blank" });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post does not exist" });

        const comment = await Comment.create({
            content,
            post: postId,
            author: userId,
        });

        res.status(201).json(comment);
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * GET /api/comments/post/:postId/
 * Get all comments for a specific post.
 * 
 * Path parameters:
 * - postId: string   // ID of the post to fetch comments for
 * 
 * Response:
 * 200 OK with a list of comments, populated with author info.
 */
export const getCommentsByPost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        const comments = await Comment.find({ post: postId })
            .populate({
                path: "author",
                select: "username",
            })
            .sort({ createdAt: -1 })
            .lean();

        comments.map((comment: any) => {
            const authorId = comment.author?._id;
            comment.author.avatarUrl = `/api/users/${authorId}/avatar`;
            return comment;
        });

        res.json(comments);

    } catch (err: any) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};

/**
 * DELETE /api/comments/:commentId
 * Delete a specific comment.
 * Requires authentication.
 * 
 * Path parameters:
 * - commentId: string   // ID of the comment to delete
 * 
 * Authorization:
 * Only the author of the comment can delete it.
 * 
 * Response:
 * 200 OK with success message, or 403 if unauthorized.
 */
export const deleteComment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = getAuthUserId(req);

        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment does not exist" });

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You do not have permission to delete this comment." });
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted" });
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};
