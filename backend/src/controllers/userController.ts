import Profile from "../models/Profile";
import { Response } from 'express';
import Post from "../models/Post";
import { AuthRequest } from "../types/customRequest";
import { getAuthUserId } from "../utils/getAuthUserId";
import mongoose from "mongoose";

/**
 * GET /api/user/me
 * Get the profile information of the currently authenticated user.
 */
export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Tìm profile
    const profile = await Profile.findOne({ user: user._id }).lean();

    const myProfile = {
      userId: user._id,
      username: user.username,
      email: user.email,
      avatar: profile?.avatar ?? "",
      bio: profile?.bio ?? "",
      gender: profile?.gender ?? "prefer_not_to_say",
      birthday: profile?.birthday ?? null,
      location: profile?.location ?? "",
      followersCount: profile?.followers?.length ?? 0,
      followingCount: profile?.following?.length ?? 0,
      postCount: await Post.countDocuments({ author: user._id }),
    };

    res.status(200).json(myProfile);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * PUT /api/user/update
 * Update current user's profile (bio, avatar, birthday, gender, location)
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = getAuthUserId(req);
    const allowedFields = ['bio', 'avatar', 'birthday', 'gender', 'location'];
    const incomingFields = Object.keys(req.body);

    // Validate fields
    const invalidFields = incomingFields.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid field(s): ${invalidFields.join(', ')}`
      });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * DELETE /api/user/follower/:followerId
 * Remove a follower from the user's profile
 */
export const removeFollower = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = getAuthUserId(req);
    const { followerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(followerId)) {
      return res.status(400).json({ message: "Invalid followerId" })
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const index = profile.followers.findIndex(id => id.toString() === followerId);
    if (index === -1) {
      return res.status(404).json({ message: "Follower not found" });
    }

    profile.followers.splice(index, 1);

    await profile.save();

    return res.status(200).json({ message: "Follower removed successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * DELETE /api/user/following/:followingId
 * Unfollow a user (remove from following list)
 */
export const unfollowUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = getAuthUserId(req);
    const { followingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(404).json({ message: "Invalid followingId" });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const index = profile.following.findIndex(id => id.toString() === followingId);
    if (index === -1) {
      return res.status(404).json({ message: "Following user not found" });
    }

    profile.following.splice(index, 1);
    await profile.save();

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

