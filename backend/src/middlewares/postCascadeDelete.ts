import { Schema } from "mongoose";
import Comment from "../models/Comment";
import PostStats from "../models/PostStats";

/**
 * Middleware for Post: Delete all comments when deleting a post
 */
const applyPostCascadeDelete = (PostSchema: Schema) => {
    PostSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
        const postId = this._id;
        try {
            // Delete related comments
            await Comment.deleteMany({ post: postId });
            // Delete related post stats
            await PostStats.deleteOne({ post: postId });
        } catch (error: any) {
            console.error("Failed to delete comments when deleting post:", error);
            return next(error);
        }
        next();
    });
};

export default applyPostCascadeDelete;
