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

        try {
            const userId = this._id;
            const userPosts = await Post.find({ author: userId }).select("_id");
            const postIds = userPosts.map(post => post._id);

            await Promise.all([
                Post.deleteMany({ author: userId }),
                PostStats.deleteMany({ post: { $in: postIds } }),
                Comment.deleteMany({ author: userId }),
                Profile.deleteOne({ user: userId }),
                Profile.updateMany({ followers: userId }, { $pull: { followers: userId } }),
                Profile.updateMany({ following: userId }, { $pull: { following: userId } })
            ]);

            next();
        } catch (error: any) {
            return next(error);
        }
    });
};

export default applyUserCascadeDelete;
