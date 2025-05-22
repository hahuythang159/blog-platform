import { Request, Response } from "express";
import User from "../../models/User";
import Profile from "../../models/Profile";
import { AuthRequest } from "../../types/customRequest";
import Ban from "../../models/Ban";

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

/** 
 * PATCH /api/admin/users/:userId/ban
 * Toggle the ban status of a user by their user ID.
 * 
 * - If the user is not banned, the user will be banned with the provided reason.
 * - If the user is already banned, the user will be unbanned.
 * 
 * Request Params:
 * - userId (string): The ID of the user to ban or unban.
 * 
 * Request Body:
 * - reason (string, optional): The reason for banning the user (only required when banning).
 * 
 * Response:
 * - 200 OK if the user's ban status has been successfully toggled:
 *    - Message indicating whether the user is now banned or unbanned.
 *    - userId (string): The ID of the user.
 *    - isBanned (boolean): `true` if the user is banned, `false` if unbanned.
 *    - reason (string, optional): The reason for banning (only when banning).
 * 
 * - 404 Not Found if the user with the given userId does not exist.
 * 
 * - 500 Internal Server Error if the operation fails.
 */
export const toggleBanUser = async (req: AuthRequest, res: any) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const activeBan = await Ban.findOne({ user: user._id, isActive: true });

        if (activeBan) {
            // Unban
            activeBan.isActive = false;
            await activeBan.save();

            return res.status(200).json({
                message: "User has been unbanned",
                userId: user._id,
                isBanned: false,
            });
        } else {
            const ban = new Ban({
                user: user._id,
                reason,
                bannedBy: req.user?.id,
                isActive: true,
            });
            await ban.save();

            return res.status(200).json({
                message: "User has been banned",
                userId: user._id,
                isBanned: true,
                reason,
            });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
};