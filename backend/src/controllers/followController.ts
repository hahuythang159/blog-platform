import { Request, Response } from "express";
import mongoose from "mongoose";
import Profile from "../models/Profile";
import User from "../models/User";

export const toggleFollow = async (req: Request, res: any) => {
  const { followerId } = req.body;
  const { username } = req.params;

  try {
    const targetUser = await User.findOne({ username });

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const targetProfile = await Profile.findOne({ user: targetUser._id });
    const followerProfile = await Profile.findOne({ user: followerId });

    if (!targetProfile || !followerProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const followerObjId = mongoose.Types.ObjectId.createFromHexString(String(followerId));
    const targetUserObjId = mongoose.Types.ObjectId.createFromHexString(String(targetUser._id));

    const isAlreadyFollowing = targetProfile.followers.some((id) =>
      id.toString() === followerId
    );

    if (isAlreadyFollowing) {
      // 🔻 Unfollow
      targetProfile.followers = targetProfile.followers.filter(
        (id) => id.toString() !== followerId
      );
      followerProfile.following = followerProfile.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
    } else {
      // 🔺 Follow
      targetProfile.followers.push(followerObjId);
      followerProfile.following.push(targetUserObjId);
    }

    await targetProfile.save();
    await followerProfile.save();

    return res.status(200).json({ following: !isAlreadyFollowing });
  } catch (error) {
    console.error("toggleFollow error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
