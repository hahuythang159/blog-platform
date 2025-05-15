import { Schema } from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Profile from "../models/Profile";
import PostStats from "../models/PostStats";

/**
 * Middleware for User: Delete posts, comments, profiles,
 * and remove them from other people's followers/following list
 */
const applyUserCascadeDelete = (UserSchema: Schema) => {
    UserSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
        const userId = this._id;
        try {
            const userPosts = await Post.find({ author: userId }).select("_id");
            const postIds = userPosts.map(post => post._id);
            await Post.deleteMany({ author: userId });
            await PostStats.deleteMany({ post: { $in: postIds } });
            await Comment.deleteMany({ author: userId });
            await Profile.deleteOne({ user: userId });

            await Profile.updateMany({ followers: userId }, { $pull: { followers: userId } });
            await Profile.updateMany({ following: userId }, { $pull: { following: userId } });
        } catch (error: any) {
            console.error("Failed to cascade delete for user:", error);
            return next(error);
        }
        next();
    });
};

export default applyUserCascadeDelete;
