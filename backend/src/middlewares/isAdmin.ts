import { NextFunction } from "express";
import { AuthRequest } from "../types/customRequest";

export const isAdmin = async (req: AuthRequest, res: any, next: NextFunction) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        next();
    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};
