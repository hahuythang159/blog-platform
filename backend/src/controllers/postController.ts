import { Response } from "express";
import { AuthRequest } from "../types/customRequest";
import Post from "../models/Post";
import Tag from "../models/Tag";
import slugify from "slugify";
import mongoose from "mongoose";
import Profile from "../models/Profile";

/**
 * GET /api/posts
 *
 * Description:
 * Fetch a list of blog posts from the server. 
 * 
 * Optional Query Parameters:
 * - tag (string): Filter posts by a specific tag's slug. 
 *   When provided, the API returns only posts that are associated with the given tag.
 *   If the tag does not exist, the API returns a 404 error.
 *
 * - q (string): Search keyword to filter posts by matching text in the post's title or content.
 *   The search is performed using a full-text search, and results are ranked by relevance.
 *
 * Usage:
 * - If neither `tag` nor `q` is provided, all posts are returned sorted by creation date (newest first).
 * - If both `tag` and `q` are provided, posts are filtered by the tag first, then searched by the keyword.
 *
 * Response:
 * - 200 OK: Returns an array of posts matching the filter/search criteria.
 * - 404 Not Found: Returned if the specified tag slug does not exist.
 * - 500 Internal Server Error: Returned on unexpected server errors.
 */
export const getPosts = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const tagSlug = (req.query.tag as string) || null;
        const keyword = (req.query.q as string) || null;
        let filter: any = {};

        if (tagSlug) {
            const tag = await Tag.findOne({ slug: tagSlug }).lean();
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
            filter.tags = tag._id;
        }

        // Search by keyword (title/content)
        if (keyword) {
            filter.$text = { $search: keyword };
        }

        const posts = await Post.find(filter, keyword ? { score: { $meta: "textScore" } } : {})
            .sort(keyword ? { score: { $meta: "textScore" } } : { createdAt: -1 })
            .select('title content author tags createdAt updatedAt')
            .populate('author', 'username')
            .populate('tags', 'name slug')
            .lean();


        const result = posts.map(post => {
            if (post.author?._id) {
                (post.author as any).avatarUrl = `/api/user/avatar/${post.author._id}`;
            }
            return post;
        });

        res.json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

/**
 * GET /api/posts/:id
 * Get detailed information about a specific post, including author and tags.
 * Useful for rendering the full post view on the frontend.
 */
export const getPostById = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const post = await Post.findById(req.params.id)
            .sort({ createdAt: -1 })
            .select('title content author tags createdAt updatedAt')
            .populate('author', 'username')
            .populate('tags', 'name slug')
            .lean();
        if (!post) return res.status(404).json({ message: "Post does not exist" });

        // Add avatar URL
        if (post.author?._id) {
            (post.author as any).avatarUrl = `/api/users/${post.author._id}/avatar`;
        }

        res.json(post);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

/**
 * POST /api/posts
 * Create a new post with title, content, and optional tags.
 * Only authenticated users can create posts.
 */
export const createPost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) return res.status(401).json({ message: "The user is not logged in" });

        const { title, content, tags = [] } = req.body;
        if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

        const tagIds: mongoose.Types.ObjectId[] = [];
        for (let raw of tags) {
            const name = String(raw).trim().toLowerCase();
            const slug = slugify(name, { lower: true });
            let tag = await Tag.findOne({ slug });
            if (!tag) tag = await Tag.create({ name, slug });
            tagIds.push(tag._id as mongoose.Types.ObjectId);
        }

        const newPost = new Post({ title, content, tags: tagIds, author: req.user.id });
        await newPost.save();
        res.status(201).json({ message: "Posted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

/**
 * PUT /api/posts/:id
 * Update an existing post (title and content).
 * Only the author of the post can update it.
 */
export const updatePost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) return res.status(401).json({ message: "The user is not logged in" });

        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id) res.status(403).json({ message: "Forbidden" });

        post.title = title;
        post.content = content;
        await post.save();

        res.json(post);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

/**
 * DELETE /api/posts/:id
 * Delete a specific post.
 * Only the author of the post can delete it.
 */
export const deletePost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) return res.status(401).json({ message: "The user is not logged in" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

/**
 * GET /api/posts/following
 * Get a list of posts from users the current user is following.
 * Optionally filters posts by a tag slug (?tag=slug).
 * Useful for displaying a personalized feed based on following relationships.
 */
export const getFollowingPosts = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;

        const tagSlug = (req.query.tag as string) || null;
        const filter: any = {};

        if (tagSlug) {
            const tag = await Tag.findOne({ slug: tagSlug }).lean();
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
            filter.tags = tag._id;
        }

        const profile = await Profile.findOne({ user: userId }).select('following');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const followedUserIds = (profile.following || []).map(id => new mongoose.Types.ObjectId(id));

        if (followedUserIds.length === 0) {
            return res.json([]);
        }

        filter.author = { $in: followedUserIds };

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .select('title content author tags createdAt updatedAt')
            .populate('author', 'username')
            .populate('tags', 'name slug')
            .lean();

        const result = posts.map(post => {
            if (post.author?._id) {
                (post.author as any).avatarUrl = `/api/user/avatar/${post.author._id}`;
            }
            return post;
        });

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
