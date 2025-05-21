import { Response } from "express";
import User from "../../models/User";
import Post from "../../models/Post";
import Comment from "../../models/Comment";
import PostStats from "../../models/PostStats";
import { AuthRequest } from "../../types/customRequest";

/** 
 * GET /api/admin/stats
 * Get system statistics: total number of users, posts, and comments.
 * 
 * Response:
 * - 200 OK with total counts for users, posts, and comments.
 * - 500 Internal Server Error if the operation fails.
 */
export const getSystemStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalComments = await Comment.countDocuments();

        res.status(200).json({ totalUsers, totalPosts, totalComments });
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};


/** 
 * GET /api/admin/stats/top-posts
 * Get the top 5 most viewed posts based on post statistics.
 * 
 * Response:
 * - 200 OK with an array of top posts, including post title, view count, like count, and author.
 * - 500 Internal Server Error if the operation fails.
 */
export const getTopPosts = async (req: AuthRequest, res: Response): Promise<void>  => {
    try {
        const topPosts = await PostStats.find()
            .sort({ views: -1 })
            .limit(5)
            .populate({
                path: "post",
                select: "title",
                populate: {
                    path: "author",
                    select: "username"
                }
            })
            .lean();

        const formatted = topPosts.map((item: any) => ({
            postId: item.post?._id ?? null,
            title: item.post?.title ?? "",
            views: item.views,
            likes: item.likes?.length ?? 0,
            author: item.post?.author?.username ?? "Unknown"
        }));

        res.status(200).json(formatted);
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};
