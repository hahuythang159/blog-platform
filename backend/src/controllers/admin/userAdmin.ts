import { Request, Response } from "express";
import User from "../../models/User";
import Profile from "../../models/Profile";

/** 
 * GET /api/admin/users
 * Get a list of all users with their basic details (username, email) and profile information (avatar).
 * 
 * Response:
 * - 200 OK with an array of users, including username, email, and avatar (if available).
 * - 500 Internal Server Error if the operation fails.
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("username email").lean();

        const usersWithProfile = await Promise.all(
            users.map(async (user: any) => {
                const profile = await Profile.findOne({ user: user._id });
                return {
                    ...user,
                    avatar: profile?.avatarData ? `/api/user/avatar/${user._id}` : "",
                };
            })
        );

        res.status(200).json(usersWithProfile);
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};
