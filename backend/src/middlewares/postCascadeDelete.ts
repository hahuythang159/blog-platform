import { Schema } from "mongoose";
import Comment from "../models/Comment";
import PostStats from "../models/PostStats";
import Post from "../models/Post";
import Tag from "../models/Tag";

/**
 * Middleware for Post: Delete all comments, stats, and orphaned tags when deleting a post
 */
const applyPostCascadeDelete = (PostSchema: Schema) => {
    PostSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
        try {
            const postId = this._id;
            
            // Get tags information (if any)
            const post = await Post.findById(postId).select("tags");
            const tagIds: string[] = post?.tags?.map(tag => tag.toString()) || [];
            
            await Promise.all([
                // Delete related comments
                Comment.deleteMany({ post: postId }),
                // Delete related post stats
                PostStats.deleteOne({ post: postId })
            ]);

            // Count all posts using this tagId, if there are no posts using this tagId anymore then delete it
            for (const tagId of tagIds) {
                const count = await Post.countDocuments({ tags: tagId });
                if (count === 0) {
                    await Tag.deleteOne({ _id: tagId });
                }
            }

            next();
        } catch (error: any) {
            return next(error);
        }
        next();
    });
};

export default applyPostCascadeDelete;
