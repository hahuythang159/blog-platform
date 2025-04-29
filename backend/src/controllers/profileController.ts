import { Request } from "express";
import Profile from "../models/Profile";
import Post from "../models/Post";
import User from "../models/User";

/**
 * GET /api/profile/:username
 * Get user's public profile information based on username.
 */
export const getPublicProfile = async (req: Request, res: any) => {
  try {
    const username = req.params.username;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find profile
    const profile = await Profile.findOne({ user: user._id }).lean();

    // But still fallback if for some reason the profile does not exist yet
    const publicProfile = {
      userId: user._id,
      username: user.username,
      avatar: profile?.avatar ?? "",
      bio: profile?.bio ?? "",
      gender: profile?.gender ?? "prefer_not_to_say",
      followersCount: profile?.followers?.length ?? 0,
      followingCount: profile?.following?.length ?? 0,
      postCount: await Post.countDocuments({ author: user._id }),
    };

    return res.status(200).json(publicProfile);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/profile/:username/posts
 * Get a list of user posts by username.
 */
export const getUserPostsByUsername = async (req: Request, res: any) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return res.status(200).json(posts);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * POST /api/follow/:username
 * Check if a user (followerId) is following the user with username.
 * followerId is passed via the query string (?following=abc).
 */
export const checkIsFollowing = async (req: Request, res: any) => {
  const { username } = req.params;
  const followerId = req.query.followerId as string;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Target user not found" });

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ message: "Target profile not found" });

    const isFollowing = profile.followers.some(
      (id) => id.toString() === followerId.toString()
    );

    return res.status(200).json({ isFollowing });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/profile/:username/followers
 * Get a list of a user's followers (based on their profile), along with some basic information.
 */
export const getFollowers = async (req: Request, res: any) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await Profile.findOne({ user: user._id }).populate({
      path: 'followers',
      select: 'username email avatar', // whatever you want
    });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    return res.status(200).json({ followers: profile.followers });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/profile/:username/following
 * Get a list of people the user is following.
 */
export const getFollowing = async (req: Request, res: any) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await Profile.findOne({ user: user._id }).populate({
      path: 'following',
      select: 'username email avatar',
    });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    return res.status(200).json({ following: profile.following });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
