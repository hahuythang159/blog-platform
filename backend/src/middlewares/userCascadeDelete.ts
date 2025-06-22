import { Schema } from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Profile from "../models/Profile";
import PostStats from "../models/PostStats";
import Tag from "../models/Tag";

/**
 * Middleware for User: Delete posts, comments, profiles,
 * and remove them from other people's followers/following list
 */
const applyUserCascadeDelete = (UserSchema: Schema) => {
    UserSchema.pre("deleteOne", { document: true, query: false }, async function (next) {

        try {
            const userId = this._id;

            // Get all posts of user
            const userPosts = await Post.find({ author: userId }).select("_id tags");
            const postIds = userPosts.map(post => post._id);

            // Collect all tags used in the post
            const allTagIds = new Set<string>();
            for (const post of userPosts) {
                if (Array.isArray(post.tags)) {
                    post.tags.forEach(tagId => allTagIds.add(tagId.toString()));
                }
            }

            await Promise.all([
                Post.deleteMany({ author: userId }),
                PostStats.deleteMany({ post: { $in: postIds } }),
                Comment.deleteMany({ author: userId }),
                Profile.deleteOne({ user: userId }),
                Profile.updateMany({ followers: userId }, { $pull: { followers: userId } }),
                Profile.updateMany({ following: userId }, { $pull: { following: userId } })
            ]);

            // Check which tags have no more posts in use
            const tagIdList = Array.from(allTagIds);
            if (tagIdList.length > 0) {
                const tagCheckTasks = tagIdList.map(tagId =>
                    Post.countDocuments({ tags: tagId }).then(count => ({ tagId, count }))
                );

                const tagResults = await Promise.all(tagCheckTasks);
                const orphanTags = tagResults.filter(tag => tag.count === 0).map(tag => tag.tagId);

                if (orphanTags.length > 0) {
                    await Tag.deleteMany({ _id: { $in: orphanTags } });
                }
            }

            next();
        } catch (error: any) {
            return next(error);
        }
    });
};

export default applyUserCascadeDelete;
