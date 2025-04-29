import { Response } from "express";
import { AuthRequest } from "../types/customRequest";
import Post from "../models/Post";

// Get list of Posts
export const getPost = async (req: AuthRequest, res: Response) => {
    try {
        const posts = await Post.find().populate("author", "username");
        res.json(posts);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Get Post Details
export const getPostById = async (req: AuthRequest, res: any) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "username");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Create a new Post
export const createPost = async (req: AuthRequest, res: any) => {
    try {
        if (!req.user) return res.status(401).json({ message: "The user is not logged in" });

        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

        const newPost = new Post({ title, content, author: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Update Post
export const updatePost = async (req: AuthRequest, res: any) => {
    try {
        if (!req.user)  return res.status(401).json({ message: "The user is not logged in" });

        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id)  res.status(403).json({ message: "Forbidden" });

        post.title = title;
        post.content = content;
        await post.save();

        res.json(post);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Delete Post
export const deletePost = async (req: AuthRequest, res: any) => {
    try {
        if (!req.user) return res.status(401).json({ message: "The user is not logged in" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully"});
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
