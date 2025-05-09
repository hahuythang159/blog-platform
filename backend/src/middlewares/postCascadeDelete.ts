import { Schema } from "mongoose";
import Comment from "../models/Comment";

/**
 * Middleware for Post: Delete all comments when deleting a post
 */
const applyPostCascadeDelete = (PostSchema: Schema) => {
    PostSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
        const postId = this._id;
        try {
            await Comment.deleteMany({ post: postId });
        } catch (error) {
            console.error("Failed to delete comments when deleting post:", error);
        }
        next();
    });
};

export default applyPostCascadeDelete;
