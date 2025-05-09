import Profile from "../models/Profile";
import { Response } from 'express';
import Post from "../models/Post";
import { AuthRequest } from "../types/customRequest";
import { getAuthUserId } from "../utils/getAuthUserId";
import mongoose from "mongoose";
import { upload } from "../middlewares/multerConfig";

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

    // Find profile
    const profile = await Profile.findOne({ user: user._id }).lean();

    const avatarExists = profile?.avatarData && profile?.avatarType;

    const myProfile = {
      userId: user._id,
      username: user.username,
      email: user.email,
      avatar: avatarExists ? `/api/user/avatar/${user._id}` : "",
      bio: profile?.bio ?? "",
      gender: profile?.gender ?? "prefer_not_to_say",
      birthday: profile?.birthday ?? null,
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
 * Update current user's profile (bio, birthday, gender)
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = getAuthUserId(req);
    const allowedFields = ['bio', 'birthday', 'gender'];

    // Validate fields
    const incomingFields = Object.keys(req.body).filter(field => allowedFields.includes(field));

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

    // Update the profile fields
    incomingFields.forEach(fields => {
      // Type-safe assignment
      (profile as any)[fields] = req.body[fields];
    });

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

/**
 * GET /api/user/avatar/:userId
 * Trả về ảnh avatar từ MongoDB Buffer
 */
export const getUserAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });

    if (!profile || !profile.avatarData || !profile.avatarType) {
      res.status(204).send();
      return;
    }

    res.set("Content-Type", profile.avatarType);
    res.send(profile.avatarData);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * POST /api/user/upload-avatar
 * Lưu ảnh avatar vào DB dưới dạng Buffer
 */
export const uploadAvatar = [
  upload.single("avatar"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const userId = getAuthUserId(req);
      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }

      profile.avatarData = file.buffer;
      profile.avatarType = file.mimetype;
      await profile.save();

      res.status(200).json({ message: "Avatar uploaded successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  }
];