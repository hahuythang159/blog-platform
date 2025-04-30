import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import Profile from "../models/Profile";
import { Types } from "mongoose";

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create Profile object with user._id
    const profile = new Profile({
      user: user._id,
      avatar: "",
      bio: "",
      gender: "prefer_not_to_say",
      followers: [],
      following: [],
    });

    await profile.save();

    // Update user with profile._id
    user.profile = profile._id as Types.ObjectId;
    await user.save();

    return res.status(201).json({ message: "User registered successfully"});
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.json({ token: generateToken(user.id, user.username) });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}