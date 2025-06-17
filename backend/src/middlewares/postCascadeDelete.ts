import { Schema } from "mongoose";
import Comment from "../models/Comment";
import PostStats from "../models/PostStats";

/**
 * Middleware for Post: Delete all comments when deleting a post
 */
const applyPostCascadeDelete = (PostSchema: Schema) => {
    PostSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
        try {
            const postId = this._id;
            await Promise.all([
                // Delete related comments
                Comment.deleteMany({ post: postId }),
                // Delete related post stats
                PostStats.deleteOne({ post: postId })
            ]);

            next();
        } catch (error: any) {
            return next(error);
        }
        next();
    });
};

export default applyPostCascadeDelete;
